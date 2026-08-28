import * as React from "react";

import { IHomeHighlightsProps } from "./IHomeHighlightsProps";
import { IDocumentItem } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn, getFileExtension } from "../../../common/utils/spUtils";
import { FaqList } from "../../faqList/components/FaqList";
import {
  fileIcon,
  iconColor,
} from "../../documentsList/components/DocumentsList";
import { CountdownTimer } from "../../countdownTimer/components/CountdownTimer";

/**
 * HomeHighlights — dernière bande de l'accueil, trois cartes sur une ligne.
 *
 * Les trois colonnes réutilisent des données DÉJÀ chargées par
 * `IntranetMainWebPart` (`getFaq`, `getDocuments`, `getEvents`) : cette
 * section n'ajoute aucun appel réseau.
 */

const DEFAULT_MAX_FAQ = 4;
const DEFAULT_MAX_DOCS = 5;

function relativeDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";

  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 31) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "Il y a 1 semaine" : `Il y a ${weeks} semaines`;
  }
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Carte de la bande : en-tête (barrette accent + titre + icône), corps
 * extensible, et pied « Voir tout » aligné en bas. `flex-col` + `flex-1` sur
 * le corps : les trois cartes gardent la même hauteur quel que soit leur
 * contenu, et les trois pieds restent alignés.
 */
const HighlightCard: React.FC<{
  title: string;
  iconName: string;
  linkLabel?: string;
  linkHref?: string;
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}> = (props) => (
  <section className="ika-flex ika-h-full ika-flex-col ika-overflow-hidden ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-shadow-sm ika-transition-shadow hover:ika-shadow-md">
    <header className="ika-flex ika-items-center ika-justify-between ika-gap-3 ika-border-b ika-border-brand-line ika-px-5 ika-py-4">
      <div className="ika-flex ika-items-center ika-gap-2">
        <span
          aria-hidden="true"
          className="ika-h-5 ika-w-1 ika-rounded-full ika-bg-brand-accent"
        />
        <h2 className="ika-text-lg ika-font-extrabold ika-tracking-tight ika-text-brand-navy">
          {props.title}
        </h2>
      </div>
      <Icon
        name={props.iconName}
        className="ika-h-5 ika-w-5 ika-shrink-0 ika-text-brand-cyan"
      />
    </header>

    <div className="ika-flex ika-flex-1 ika-flex-col ika-p-5">
      {props.children}
    </div>

    {props.linkLabel && props.linkHref ? (
      <a
        href={props.linkHref}
        onClick={props.onLinkClick}
        className="ika-flex ika-items-center ika-justify-between ika-gap-2 ika-border-t ika-border-brand-line ika-px-5 ika-py-3 ika-text-sm ika-font-semibold ika-text-brand-cyan-dark ika-transition-colors hover:ika-bg-brand-surface focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-inset focus-visible:ika-ring-brand-cyan"
      >
        {props.linkLabel}
        <Icon name="ChevronRight" className="ika-h-4 ika-w-4" />
      </a>
    ) : null}
  </section>
);

const DocumentRow: React.FC<{ doc: IDocumentItem }> = (props) => {
  const { doc } = props;
  const isFolder = doc.FSObjType === 1;
  const ext = isFolder ? "" : getFileExtension(doc.FileLeafRef);
  const displayName = doc.Title || doc.FileLeafRef;

  return (
    <li>
      <a
        href={doc.FileRef}
        data-interception="propagate"
        className="ika-flex ika-items-center ika-gap-3 ika-rounded-xl ika-px-2 ika-py-2 ika-transition-colors hover:ika-bg-brand-surface focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-inset focus-visible:ika-ring-brand-cyan"
      >
        <span
          className={cn(
            "ika-shrink-0 ika-rounded-lg ika-p-2",
            isFolder ? "ika-bg-amber-50 ika-text-amber-600" : iconColor(ext)
          )}
        >
          <Icon
            name={isFolder ? "FolderOpen" : fileIcon(ext)}
            className="ika-h-4 ika-w-4"
          />
        </span>

        <span className="ika-min-w-0 ika-flex-1">
          <span className="ika-block ika-truncate ika-text-sm ika-font-medium ika-text-brand-navy">
            {displayName}
          </span>
          <span className="ika-block ika-truncate ika-text-xs ika-text-brand-muted">
            {relativeDate(doc.Modified)}
            {doc.DocCategory ? ` · ${doc.DocCategory}` : ""}
          </span>
        </span>
      </a>
    </li>
  );
};

export const HomeHighlights: React.FC<IHomeHighlightsProps> = (props) => {
  const {
    faqTitle,
    documentsTitle,
    countdownTitle,
    faqItems,
    documents,
    events,
    loading,
    maxFaqItems,
    maxDocuments,
    onNavigate,
  } = props;

  const faqSlice = React.useMemo(
    () => (faqItems || []).slice(0, maxFaqItems || DEFAULT_MAX_FAQ),
    [faqItems, maxFaqItems]
  );

  // Les documents arrivent déjà en « Modified desc » de SharePoint : on ne
  // retrie pas côté client, on coupe simplement la tête de liste.
  const docSlice = React.useMemo(
    () => (documents || []).slice(0, maxDocuments || DEFAULT_MAX_DOCS),
    [documents, maxDocuments]
  );

  const navigate =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement>): void => {
      if (!onNavigate) return;
      event.preventDefault();
      onNavigate(route);
    };

  return (
    <div className="ika-root">
      <section className="ika-w-full ika-bg-white ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
        <div className="ika-mx-auto ika-grid ika-max-w-7xl ika-grid-cols-1 ika-items-stretch ika-gap-6 lg:ika-grid-cols-3">
          {/* ── FAQ ── */}
          <HighlightCard
            title={faqTitle || "Questions fréquentes"}
            iconName="lifebuoy"
            linkLabel="Voir toute la FAQ"
            linkHref="#faq"
            onLinkClick={navigate("faq")}
          >
            {/* `title=""` : l'en-tête de carte porte déjà le titre.
                `columns={1}` : une colonne par carte, pas la grille 2×N de la
                page FAQ complète. */}
            <FaqList
              title=""
              items={faqSlice}
              loading={loading}
              columns={1}
              groupByCategory={false}
              allowMultipleOpen={false}
            />
          </HighlightCard>

          {/* ── DOCUMENTS RÉCENTS ── */}
          <HighlightCard
            title={documentsTitle || "Documents récents"}
            iconName="FileText"
            linkLabel="Voir la bibliothèque"
            linkHref="#documents"
            onLinkClick={navigate("documents")}
          >
            {loading ? (
              <div className="ika-space-y-3 ika-animate-pulse" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="ika-flex ika-items-center ika-gap-3">
                    <span className="ika-h-9 ika-w-9 ika-shrink-0 ika-rounded-lg ika-bg-slate-200" />
                    <span className="ika-flex-1 ika-space-y-1.5">
                      <span className="ika-block ika-h-3 ika-w-3/4 ika-rounded ika-bg-slate-200" />
                      <span className="ika-block ika-h-2.5 ika-w-1/3 ika-rounded ika-bg-slate-100" />
                    </span>
                  </div>
                ))}
              </div>
            ) : docSlice.length === 0 ? (
              <div className="ika-flex ika-flex-1 ika-items-center ika-justify-center ika-rounded-2xl ika-border ika-border-dashed ika-border-brand-line ika-px-4 ika-py-8 ika-text-center ika-text-sm ika-text-brand-muted">
                Aucun document récent.
              </div>
            ) : (
              <ul className="ika-space-y-1">
                {docSlice.map((doc) => (
                  <DocumentRow key={doc.Id} doc={doc} />
                ))}
              </ul>
            )}
          </HighlightCard>

          {/* ── COMPTE À REBOURS ── */}
          <HighlightCard
            title={countdownTitle || "Prochaine échéance"}
            iconName="Clock"
            linkLabel="Voir l'agenda"
            linkHref="#agenda"
            onLinkClick={navigate("agenda")}
          >
            {/* `title=""` : l'en-tête de carte porte déjà le titre. */}
            <CountdownTimer title="" events={events} loading={loading} />
          </HighlightCard>
        </div>
      </section>
    </div>
  );
};
