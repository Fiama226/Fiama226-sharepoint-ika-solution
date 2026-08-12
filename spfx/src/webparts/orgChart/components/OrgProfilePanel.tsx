import * as React from "react";

import { ICollaborateur } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { useFocusTrap } from "../../../common/hooks/useFocusTrap";
import { divisionStyle } from "../../../common/utils/divisionStyle";
import {
  buildImageUrl,
  buildUserPhotoUrl,
  cn,
  formatDate,
} from "../../../common/utils/spUtils";

export interface IOrgProfilePanelProps {
  member: ICollaborateur;
  manager?: ICollaborateur;
  reports: ICollaborateur[];
  onClose: () => void;
  onSelect: (member: ICollaborateur) => void;
}

function photoFor(member: ICollaborateur, size: number): string {
  if (member.Photo) {
    const fromList = buildImageUrl(member.Photo, size);
    if (fromList) return fromList;
  }
  return buildUserPhotoUrl(member.Email, "L");
}

const Row: React.FC<{
  icon: string;
  label: string;
  children: React.ReactNode;
}> = (props) => (
  <div className="ika-flex ika-items-center ika-gap-3">
    <span className="ika-grid ika-h-8 ika-w-8 ika-shrink-0 ika-place-items-center ika-rounded-lg ika-bg-slate-100 ika-text-slate-500">
      <Icon name={props.icon} className="ika-h-4 ika-w-4" />
    </span>
    <div className="ika-min-w-0">
      <p className="ika-text-[11px] ika-uppercase ika-tracking-wider ika-text-slate-400">
        {props.label}
      </p>
      <div className="ika-truncate ika-text-sm ika-text-brand-ink">
        {props.children}
      </div>
    </div>
  </div>
);

const MiniCard: React.FC<{
  member: ICollaborateur;
  onSelect: (member: ICollaborateur) => void;
}> = (props) => {
  const { member, onSelect } = props;

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="ika-flex ika-w-full ika-items-center ika-gap-2.5 ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-p-2 ika-text-left ika-transition-colors hover:ika-border-brand-cyan hover:ika-bg-slate-50 focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-cyan"
    >
      <img
        src={photoFor(member, 80)}
        alt=""
        loading="lazy"
        className="ika-h-8 ika-w-8 ika-shrink-0 ika-rounded-full ika-object-cover ika-object-top"
      />
      <span className="ika-min-w-0">
        <span className="ika-block ika-truncate ika-text-xs ika-font-semibold ika-text-brand-ink">
          {member.Title}
        </span>
        <span className="ika-block ika-truncate ika-text-[11px] ika-text-slate-400">
          {member.JobTitle}
        </span>
      </span>
    </button>
  );
};

export const OrgProfilePanel: React.FC<IOrgProfilePanelProps> = (props) => {
  const { member, manager, reports, onClose, onSelect } = props;
  const style = divisionStyle(member.Division);

  const trapOptions = React.useMemo(() => ({ onClose }), [onClose]);
  const panelRef = useFocusTrap<HTMLDivElement>(true, trapOptions);

  return (
    <div
      className="ika-fixed ika-inset-0 ika-z-[1000] ika-flex ika-justify-end ika-bg-black/50"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Profil de ${member.Title}`}
        onClick={(event) => event.stopPropagation()}
        className="ika-flex ika-h-full ika-w-full ika-max-w-sm ika-flex-col ika-overflow-y-auto ika-bg-white ika-shadow-2xl"
      >
        <div
          className={cn(
            "ika-relative ika-bg-gradient-to-br ika-px-6 ika-pb-16 ika-pt-5",
            style.gradient
          )}
        >
          <div className="ika-flex ika-items-center ika-justify-between">
            <span className="ika-inline-flex ika-items-center ika-gap-1.5 ika-rounded-full ika-bg-white/20 ika-px-3 ika-py-1 ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-white ika-backdrop-blur">
              <Icon name={style.icon} className="ika-h-3.5 ika-w-3.5" />
              {member.Division}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le profil"
              className="ika-rounded-full ika-bg-white/20 ika-p-2 ika-text-white ika-transition-colors hover:ika-bg-white/30 focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
                className="ika-h-4 ika-w-4"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="ika--mt-12 ika-flex ika-flex-col ika-items-center ika-px-6">
          <div className="ika-rounded-full ika-bg-white ika-p-1 ika-shadow-lg">
            <img
              src={photoFor(member, 240)}
              alt=""
              className={cn(
                "ika-h-24 ika-w-24 ika-rounded-full ika-object-cover ika-object-top ika-ring-4",
                style.ring
              )}
            />
          </div>
          <h2 className="ika-mt-3 ika-text-center ika-text-lg ika-font-extrabold ika-text-brand-navy">
            {member.Title}
          </h2>
          <p className="ika-mt-0.5 ika-text-center ika-text-sm ika-text-slate-500">
            {member.JobTitle}
          </p>
        </div>

        <div className="ika-mt-6 ika-space-y-3 ika-px-6">
          {member.Email ? (
            <Row icon="Mail" label="Email">
              <a
                href={`mailto:${member.Email}`}
                className="ika-text-brand-navy hover:ika-underline"
              >
                {member.Email}
              </a>
            </Row>
          ) : null}

          {member.Phone ? (
            <Row icon="Phone" label="Téléphone">
              <a
                href={`tel:${member.Phone.replace(/\s/g, "")}`}
                className="ika-text-brand-navy hover:ika-underline"
              >
                {member.Phone}
              </a>
            </Row>
          ) : null}

          {member.OfficeLocation ? (
            <Row icon="MapPin" label="Localisation">
              {member.OfficeLocation}
            </Row>
          ) : null}

          {member.HireDate ? (
            <Row icon="calendar" label="Date d'entrée">
              {formatDate(member.HireDate)}
            </Row>
          ) : null}
        </div>

        {manager ? (
          <div className="ika-mt-6 ika-px-6">
            <p className="ika-mb-2 ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-400">
              Responsable
            </p>
            <MiniCard member={manager} onSelect={onSelect} />
          </div>
        ) : null}

        {reports.length > 0 ? (
          <div className="ika-mt-6 ika-px-6 ika-pb-8">
            <p className="ika-mb-2 ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-400">
              Équipe directe ({reports.length})
            </p>
            <div className="ika-space-y-2">
              {reports.map((report) => (
                <MiniCard
                  key={report.Id}
                  member={report}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="ika-pb-8" />
        )}
      </div>
    </div>
  );
};
