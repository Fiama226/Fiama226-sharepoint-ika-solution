import { MSGraphClientV3 } from "@microsoft/sp-http";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import {
  BusyStatus,
  IBusySlot,
  ICalendarEntry,
  IEventItem,
  ITeamMemberBusy,
} from "../models/IIkaModels";
import { ISPRequestContext } from "./DataService";
import * as Mocks from "./MockData";

/** Graph refuse au-delà de 1000 ; on reste très en deçà pour la latence. */
const MAX_EVENTS = 100;

/** Granularité de `availabilityView` en minutes (valeurs admises : 5 à 1440). */
const SLOT_INTERVAL_MIN = 30;

/**
 * `getSchedule` plafonne à 20 boîtes aux lettres par appel. Au-delà, Graph
 * renvoie un HTTP 400 : on découpe donc la liste en lots.
 */
const SCHEDULE_BATCH_SIZE = 20;

interface IGraphDateTime {
  dateTime: string;
  timeZone?: string;
}

interface IGraphEvent {
  id: string;
  subject?: string;
  start?: IGraphDateTime;
  end?: IGraphDateTime;
  isAllDay?: boolean;
  location?: { displayName?: string };
  organizer?: { emailAddress?: { name?: string } };
  webLink?: string;
}

interface IGraphScheduleItem {
  status?: string;
  start?: IGraphDateTime;
  end?: IGraphDateTime;
}

interface IGraphScheduleEntry {
  scheduleId?: string;
  scheduleItems?: IGraphScheduleItem[];
  error?: { message?: string };
}

interface ISiteUser {
  Title?: string;
  Email?: string;
  PrincipalType?: number;
}

/** `PrincipalType` SharePoint : 1 = utilisateur, 4 = groupe de sécurité. */
const PRINCIPAL_TYPE_USER = 1;

/**
 * Graph renvoie `dateTime` SANS suffixe de fuseau, exprimé dans le fuseau
 * demandé via l'en-tête `Prefer`. On force UTC à la requête, il suffit donc
 * d'ajouter le `Z` que `new Date()` attend pour ne pas glisser d'heures.
 */
function toIso(value: IGraphDateTime | undefined): string {
  if (!value || !value.dateTime) return "";
  const raw = value.dateTime;
  if (/(Z|[+-]\d{2}:\d{2})$/.test(raw)) return raw;
  return `${raw}Z`;
}

function normalizeStatus(status: string | undefined): BusyStatus {
  switch (status) {
    case "free":
    case "tentative":
    case "busy":
    case "oof":
    case "workingElsewhere":
      return status;
    default:
      return "unknown";
  }
}

/**
 * Service agenda. Toute méthode Graph renvoie `undefined` — jamais une
 * exception — lorsque le consentement administrateur manque ou que l'hôte
 * n'expose pas de client Graph : l'appelant retombe alors sur les événements
 * SharePoint sans que l'utilisateur voie la moindre erreur.
 */
export class CalendarService {
  private readonly _context: ISPRequestContext;
  private readonly _webUrl: string;
  private readonly _useMocks: boolean;

  public constructor(context: ISPRequestContext) {
    this._context = context;
    this._webUrl = context.pageContext.web.absoluteUrl;

    const host =
      typeof window !== "undefined" ? window.location.hostname : "";
    this._useMocks = host === "localhost" || host === "127.0.0.1";
  }

  private async _client(): Promise<MSGraphClientV3 | undefined> {
    const factory = this._context.msGraphClientFactory;
    if (!factory) return undefined;
    try {
      return await factory.getClient("3");
    } catch (e) {
      console.warn("[CalendarService] Client Graph indisponible:", e);
      return undefined;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Calendrier personnel (Graph — Calendars.Read.Shared)              */
  /* ---------------------------------------------------------------- */

  /**
   * Rendez-vous Outlook de l'utilisateur connecté. `undefined` signale que
   * Graph n'a rien pu fournir (permission non approuvée, hôte sans Graph) —
   * à distinguer d'un tableau vide, qui signifie « agenda réellement vide ».
   */
  public async getMyEvents(
    startIso: string,
    endIso: string
  ): Promise<ICalendarEntry[] | undefined> {
    if (this._useMocks) return Mocks.MOCK_MY_CALENDAR;

    const client = await this._client();
    if (!client) return undefined;

    try {
      const select = "id,subject,start,end,isAllDay,location,organizer,webLink";
      const response = (await client
        .api("/me/calendarView")
        .header("Prefer", 'outlook.timezone="UTC"')
        .query({
          startDateTime: startIso,
          endDateTime: endIso,
          $select: select,
          $orderby: "start/dateTime",
          $top: MAX_EVENTS,
        })
        .get()) as { value?: IGraphEvent[] };

      return (response.value || []).map((evt) => ({
        Id: evt.id,
        Title: evt.subject || "(Sans objet)",
        Start: toIso(evt.start),
        End: toIso(evt.end),
        IsAllDay: evt.isAllDay === true,
        Location: evt.location ? evt.location.displayName : undefined,
        Organizer:
          evt.organizer && evt.organizer.emailAddress
            ? evt.organizer.emailAddress.name
            : undefined,
        WebLink: evt.webLink,
        Source: "outlook" as const,
      }));
    } catch (e) {
      console.warn(
        "[CalendarService] /me/calendarView refusé — " +
          "vérifier l'approbation de Calendars.Read.Shared:",
        e
      );
      return undefined;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Disponibilité de l'équipe (Graph — Calendars.Read.Shared)         */
  /* ---------------------------------------------------------------- */

  /**
   * Plages occupées des collègues. `getSchedule` respecte les réglages de
   * partage de CHAQUE personne : une personne qui ne partage rien ressort
   * avec `Slots` vide, ce qui est un résultat valide et non une panne.
   */
  public async getTeamSchedule(
    members: { Email: string; DisplayName: string }[],
    startIso: string,
    endIso: string
  ): Promise<ITeamMemberBusy[] | undefined> {
    if (this._useMocks) return Mocks.MOCK_TEAM_BUSY;

    const addressed = members.filter((m) => !!m.Email);
    if (addressed.length === 0) return [];

    const client = await this._client();
    if (!client) return undefined;

    const byEmail: { [email: string]: ITeamMemberBusy } = {};
    addressed.forEach((m) => {
      byEmail[m.Email.toLowerCase()] = {
        Email: m.Email,
        DisplayName: m.DisplayName,
        Slots: [],
      };
    });

    try {
      for (let i = 0; i < addressed.length; i += SCHEDULE_BATCH_SIZE) {
        const batch = addressed.slice(i, i + SCHEDULE_BATCH_SIZE);

        const payload = (await client.api("/me/calendar/getSchedule").post({
          schedules: batch.map((m) => m.Email),
          startTime: { dateTime: startIso, timeZone: "UTC" },
          endTime: { dateTime: endIso, timeZone: "UTC" },
          availabilityViewInterval: SLOT_INTERVAL_MIN,
        })) as { value?: IGraphScheduleEntry[] };

        (payload.value || []).forEach((entry) => {
          const key = (entry.scheduleId || "").toLowerCase();
          const target = byEmail[key];
          if (!target) return;

          if (entry.error) {
            target.Denied = true;
            return;
          }

          target.Slots = (entry.scheduleItems || [])
            .map((item) => ({
              Start: toIso(item.start),
              End: toIso(item.end),
              Status: normalizeStatus(item.status),
            }))
            .filter((slot: IBusySlot) => slot.Status !== "free" && !!slot.Start);
        });
      }

      return addressed.map((m) => byEmail[m.Email.toLowerCase()]);
    } catch (e) {
      console.warn(
        "[CalendarService] getSchedule refusé — " +
          "vérifier l'approbation de Calendars.Read.Shared:",
        e
      );
      return undefined;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Membres du site (SharePoint REST — aucune permission Graph)       */
  /* ---------------------------------------------------------------- */

  /**
   * Membres du groupe « Membres » du site. Sur un site connecté à un groupe
   * Microsoft 365, ce groupe contient souvent une seule entrée de type
   * groupe de sécurité plutôt que les personnes : on ne garde donc que les
   * principaux utilisateurs, et un résultat vide invite l'appelant à se
   * rabattre sur la liste `Collaborateurs`.
   */
  public async getSiteMembers(): Promise<
    { Email: string; DisplayName: string }[]
  > {
    if (this._useMocks) return [];

    try {
      const url =
        `${this._webUrl}/_api/web/associatedMemberGroup/users` +
        `?$select=Title,Email,PrincipalType&$top=200`;

      const response: SPHttpClientResponse =
        await this._context.spHttpClient.get(
          url,
          SPHttpClient.configurations.v1,
          { headers: { Accept: "application/json;odata=nometadata" } }
        );

      if (!response.ok) return [];

      const json = (await response.json()) as { value?: ISiteUser[] };
      return (json.value || [])
        .filter(
          (u) => u.PrincipalType === PRINCIPAL_TYPE_USER && !!u.Email
        )
        .map((u) => ({
          Email: u.Email as string,
          DisplayName: u.Title || (u.Email as string),
        }));
    } catch (e) {
      console.warn("[CalendarService] Membres du site illisibles:", e);
      return [];
    }
  }

  /* ---------------------------------------------------------------- */
  /* Fusion                                                            */
  /* ---------------------------------------------------------------- */

  /** Convertit un événement de la liste `Evenements` au format unifié. */
  public static fromListItem(item: IEventItem): ICalendarEntry {
    return {
      Id: `sp-${item.Id}`,
      Title: item.Title,
      Start: item.EventDate,
      End: item.EndDate || item.EventDate,
      IsAllDay: item.fAllDayEvent === true,
      Location: item.Location,
      Category: item.EventCategory,
      IsMandatory: item.IsMandatory,
      Source: "sharepoint",
    };
  }

  /** Fusionne les deux sources et trie chronologiquement. */
  public static merge(
    listEvents: IEventItem[],
    outlookEvents: ICalendarEntry[] | undefined
  ): ICalendarEntry[] {
    const merged = listEvents.map(CalendarService.fromListItem);
    if (outlookEvents) merged.push.apply(merged, outlookEvents);

    return merged.sort(
      (a, b) => new Date(a.Start).getTime() - new Date(b.Start).getTime()
    );
  }
}
