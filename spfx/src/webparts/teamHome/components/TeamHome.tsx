import * as React from "react";

import { ITeamHomeProps } from "./ITeamHomeProps";
import { ICollaborateur } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { useFocusTrap } from "../../../common/hooks/useFocusTrap";
import {
  buildImageUrl,
  buildUserPhotoUrl,
  cn,
  formatDate,
} from "../../../common/utils/spUtils";
import { divisionStyle } from "../../../common/utils/divisionStyle";

const ALL = "Tous";

function isBirthdaySoon(iso: string | undefined): boolean {
  if (!iso) return false;
  const birth = new Date(iso);
  if (isNaN(birth.getTime())) return false;

  const today = new Date();
  const next = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );
  if (next.getTime() < today.getTime()) {
    next.setFullYear(today.getFullYear() + 1);
  }
  const days = (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return days <= 30;
}

function photoFor(member: ICollaborateur, size: number): string {
  return member.Photo
    ? buildImageUrl(member.Photo, size)
    : buildUserPhotoUrl(member.Email, "L");
}

const MemberModal: React.FC<{
  member: ICollaborateur;
  onClose: () => void;
}> = (props) => {
  const { member, onClose } = props;
  const trapOptions = React.useMemo(() => ({ onClose }), [onClose]);
  const containerRef = useFocusTrap<HTMLDivElement>(true, trapOptions);
  const style = divisionStyle(member.Division);

  return (
    <div
      className="ika-fixed ika-inset-0 ika-z-[1000] ika-flex ika-items-center ika-justify-center ika-bg-black/70 ika-p-4"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Profil de ${member.Title}`}
        onClick={(event) => event.stopPropagation()}
        className="ika-w-full ika-max-w-md ika-overflow-hidden ika-rounded-2xl ika-bg-white ika-shadow-2xl"
      >
        <div className="ika-relative ika-h-56">
          <img
            src={photoFor(member, 600)}
            alt=""
            className="ika-h-full ika-w-full ika-object-cover ika-object-top"
          />
          <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/70 ika-to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="ika-absolute ika-right-3 ika-top-3 ika-rounded-full ika-bg-black/40 ika-p-2 ika-text-white ika-transition-colors hover:ika-bg-black/60 focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
              className="ika-h-5 ika-w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <div className="ika-absolute ika-bottom-4 ika-left-4 ika-right-4">
            <h3 className="ika-text-xl ika-font-extrabold ika-text-white">
              {member.Title}
            </h3>
            <p className="ika-text-sm ika-text-white/80">{member.JobTitle}</p>
          </div>
        </div>

        <div className="ika-space-y-3 ika-p-6">
          <span
            className={cn(
              "ika-inline-flex ika-items-center ika-gap-1.5 ika-rounded-full ika-px-3 ika-py-1 ika-text-xs ika-font-bold",
              style.bg,
              style.text
            )}
          >
            <Icon name={style.icon} className="ika-h-3.5 ika-w-3.5" />
            {member.Division}
          </span>

          <dl className="ika-space-y-2 ika-text-sm">
            {member.Email ? (
              <div className="ika-flex ika-items-center ika-gap-2">
                <dt className="ika-sr-only">Email</dt>
                <Icon name="Mail" className="ika-h-4 ika-w-4 ika-text-slate-400" />
                <dd className="ika-min-w-0">
                  <a
                    href={`mailto:${member.Email}`}
                    className="ika-block ika-truncate ika-text-brand-navy hover:ika-underline"
                  >
                    {member.Email}
                  </a>
                </dd>
              </div>
            ) : null}

            {member.Phone ? (
              <div className="ika-flex ika-items-center ika-gap-2">
                <dt className="ika-sr-only">Téléphone</dt>
                <Icon name="Phone" className="ika-h-4 ika-w-4 ika-text-slate-400" />
                <dd className="ika-text-slate-600">{member.Phone}</dd>
              </div>
            ) : null}

            {member.OfficeLocation ? (
              <div className="ika-flex ika-items-center ika-gap-2">
                <dt className="ika-sr-only">Localisation</dt>
                <Icon name="MapPin" className="ika-h-4 ika-w-4 ika-text-slate-400" />
                <dd className="ika-text-slate-600">{member.OfficeLocation}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  );
};

export const TeamHome: React.FC<ITeamHomeProps> = (props) => {
  const {
    title,
    description,
    members,
    loading,
    error,
    showSearch,
    showBirthdays,
  } = props;

  const [search, setSearch] = React.useState<string>("");
  const [division, setDivision] = React.useState<string>(ALL);
  const [selected, setSelected] = React.useState<ICollaborateur | undefined>(
    undefined
  );

  const divisions: string[] = [ALL];
  members.forEach((member) => {
    if (member.Division && divisions.indexOf(member.Division) === -1) {
      divisions.push(member.Division);
    }
  });

  const needle = search.toLowerCase().trim();
  const filtered = members.filter((member) => {
    const matchSearch =
      needle.length === 0 ||
      member.Title.toLowerCase().indexOf(needle) !== -1 ||
      (member.JobTitle || "").toLowerCase().indexOf(needle) !== -1;
    const matchDivision = division === ALL || member.Division === division;
    return matchSearch && matchDivision;
  });

  const renderBody = (): React.ReactElement => {
    if (loading) {
      return (
        <div
          className="ika-grid ika-grid-cols-1 ika-gap-4 ika-animate-pulse sm:ika-grid-cols-2 md:ika-grid-cols-3 lg:ika-grid-cols-4"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white"
            >
              <div className="ika-h-48 ika-bg-slate-200" />
              <div className="ika-space-y-2 ika-p-4">
                <div className="ika-h-4 ika-w-2/3 ika-rounded ika-bg-slate-200" />
                <div className="ika-h-3 ika-w-1/2 ika-rounded ika-bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div
          role="alert"
          className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
            Aucun collaborateur trouvé
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
            {needle || division !== ALL
              ? "Essayez un autre terme ou une autre direction."
              : "Ajoutez des collaborateurs dans la liste « Collaborateurs »."}
          </p>
        </div>
      );
    }

    return (
      <div className="ika-grid ika-grid-cols-1 ika-gap-4 sm:ika-grid-cols-2 md:ika-grid-cols-3 lg:ika-grid-cols-4">
        {filtered.map((member) => {
          const style = divisionStyle(member.Division);
          const soon = showBirthdays && isBirthdaySoon(member.Birthdate);

          return (
            <button
              key={member.Id}
              type="button"
              onClick={() => setSelected(member)}
              aria-label={`Voir le profil de ${member.Title}`}
              className="ika-group ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-text-left ika-shadow-sm ika-transition-all ika-duration-200 hover:-ika-translate-y-1 hover:ika-shadow-lg focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-accent"
            >
              <div className="ika-relative ika-h-48 ika-overflow-hidden">
                <img
                  src={photoFor(member, 400)}
                  alt=""
                  loading="lazy"
                  className="ika-h-full ika-w-full ika-object-cover ika-object-top ika-transition-transform ika-duration-500 group-hover:ika-scale-105"
                />
                {soon ? (
                  <span className="ika-absolute ika-right-3 ika-top-3 ika-flex ika-items-center ika-gap-1 ika-rounded-full ika-bg-amber-400 ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold ika-text-white">
                    <Icon name="gift" className="ika-h-3 ika-w-3" />
                    Bientôt
                  </span>
                ) : null}
                <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/50 ika-to-transparent" />
                <span
                  className={cn(
                    "ika-absolute ika-bottom-3 ika-left-3 ika-flex ika-items-center ika-gap-1 ika-rounded-full ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold",
                    style.bg,
                    style.text
                  )}
                >
                  <Icon name={style.icon} className="ika-h-3 ika-w-3" />
                  {member.Division}
                </span>
              </div>

              <div className="ika-p-4">
                <h3 className="ika-truncate ika-font-bold ika-text-slate-900 ika-transition-colors group-hover:ika-text-brand-accent">
                  {member.Title}
                </h3>
                <p className="ika-mt-0.5 ika-flex ika-items-center ika-gap-1 ika-truncate ika-text-xs ika-text-slate-400">
                  <Icon name="Briefcase" className="ika-h-3 ika-w-3" />
                  {member.JobTitle}
                </p>

                {showBirthdays && member.Birthdate ? (
                  <div className="ika-mt-3 ika-flex ika-items-center ika-gap-1 ika-border-t ika-border-slate-100 ika-pt-3 ika-text-[11px] ika-text-slate-400">
                    <Icon name="gift" className="ika-h-3 ika-w-3 ika-text-amber-500" />
                    <span>{formatDate(member.Birthdate)}</span>
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section
        className="ika-w-full ika-border-t ika-border-slate-200 ika-bg-slate-50 ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8"
        aria-labelledby="ika-team-home-title"
      >
        <div className="ika-mx-auto ika-max-w-7xl">
          <div className="ika-mb-2 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
            <div className="ika-flex ika-items-center ika-gap-2">
              <span
                aria-hidden="true"
                className="ika-h-5 ika-w-1 ika-rounded-full ika-bg-brand-accent"
              />
              <h2
                id="ika-team-home-title"
                className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900"
              >
                {title}
              </h2>
            </div>
            {!loading && !error ? (
              <span className="ika-ml-auto ika-rounded-full ika-bg-white ika-px-3 ika-py-1 ika-text-xs ika-font-bold ika-text-slate-500 ika-shadow-sm">
                {filtered.length} collaborateur{filtered.length > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>

          {description ? (
            <p className="ika-mb-6 ika-text-sm ika-text-slate-500">
              {description}
            </p>
          ) : null}

          {showSearch && !loading && !error && members.length > 0 ? (
            <div className="ika-mb-8 ika-flex ika-flex-col ika-gap-3 sm:ika-flex-row">
              <div className="ika-relative ika-flex-1">
                <span className="ika-pointer-events-none ika-absolute ika-left-3 ika-top-1/2 -ika-translate-y-1/2 ika-text-slate-400">
                  <Icon name="target" className="ika-h-4 ika-w-4" />
                </span>
                <label htmlFor="ika-team-search" className="ika-sr-only">
                  Rechercher un collaborateur
                </label>
                <input
                  id="ika-team-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher par nom ou poste…"
                  className="ika-w-full ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2.5 ika-pl-9 ika-pr-4 ika-text-sm ika-text-slate-700 ika-shadow-sm ika-outline-none ika-transition-colors focus:ika-border-brand-accent"
                />
              </div>

              {divisions.length > 1 ? (
                <div>
                  <label htmlFor="ika-team-division" className="ika-sr-only">
                    Filtrer par direction
                  </label>
                  <select
                    id="ika-team-division"
                    value={division}
                    onChange={(event) => setDivision(event.target.value)}
                    className="ika-cursor-pointer ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2.5 ika-pl-3 ika-pr-8 ika-text-sm ika-text-slate-700 ika-shadow-sm ika-outline-none ika-transition-colors focus:ika-border-brand-accent"
                  >
                    {divisions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          ) : null}

          {renderBody()}
        </div>
      </section>

      {selected ? (
        <MemberModal
          member={selected}
          onClose={() => setSelected(undefined)}
        />
      ) : null}
    </div>
  );
};
