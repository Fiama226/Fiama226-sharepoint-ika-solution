import * as React from "react";

import { ICollaborateur } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { useFocusTrap } from "../../../common/hooks/useFocusTrap";
import { divisionStyle } from "../../../common/utils/divisionStyle";
import {
  buildImageUrl,
  buildUserPhotoUrl,
  cn,
} from "../../../common/utils/spUtils";

export interface IOrgProfilePanelProps {
  member: ICollaborateur;
  manager?: ICollaborateur;
  reports: ICollaborateur[];
  onClose: () => void;
  onSelect: (member: ICollaborateur) => void;
}

function photoFor(member: ICollaborateur, size: number): string {
  return member.Photo
    ? buildImageUrl(member.Photo, size)
    : buildUserPhotoUrl(member.Email, "L");
}

export const OrgProfilePanel: React.FC<IOrgProfilePanelProps> = (props) => {
  const { member, onClose } = props;
  const style = divisionStyle(member.Division);
  const trapOptions = React.useMemo(() => ({ onClose }), [onClose]);
  const panelRef = useFocusTrap<HTMLDivElement>(true, trapOptions);
  const coordinates = [
    {
      icon: "Mail",
      label: "Email",
      value: member.Email,
      href: member.Email ? `mailto:${member.Email}` : undefined,
    },
    {
      icon: "Phone",
      label: "Téléphone",
      value: member.Phone || "—",
      href: member.Phone
        ? `tel:${member.Phone.replace(/\s/g, "")}`
        : undefined,
    },
    {
      icon: "Briefcase",
      label: "Direction",
      value: member.Division,
      href: undefined,
    },
  ];

  return (
    <div
      className="ika-fixed ika-inset-0 ika-z-[1000] ika-flex ika-items-center ika-justify-end ika-bg-black/50 ika-backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Profil de ${member.Title}`}
        onClick={(event) => event.stopPropagation()}
        className="ika-org-profile-panel ika-h-full ika-w-full ika-max-w-sm ika-overflow-y-auto ika-bg-white ika-shadow-2xl"
      >
        <div
          className={cn(
            "ika-relative ika-overflow-hidden ika-bg-gradient-to-br ika-px-6 ika-pb-16 ika-pt-6",
            style.gradient
          )}
        >
          <div
            aria-hidden="true"
            className="ika-absolute ika-inset-0 ika-opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,.12) 2px, transparent 2px)",
              backgroundSize: "60px 60px",
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le profil"
            className="ika-absolute ika-right-4 ika-top-4 ika-flex ika-h-8 ika-w-8 ika-items-center ika-justify-center ika-rounded-full ika-bg-white/20 ika-text-white ika-backdrop-blur-sm ika-transition-colors hover:ika-bg-white/30 focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-white"
          >
            <Icon name="X" className="ika-h-4 ika-w-4" />
          </button>
          <div className="ika-relative ika-text-center">
            <div className="ika-mx-auto ika-mb-3 ika-flex ika-w-fit ika-items-center ika-gap-1.5 ika-rounded-full ika-bg-white/20 ika-px-3 ika-py-1 ika-backdrop-blur-sm">
              <Icon name={style.icon} className="ika-h-[11px] ika-w-[11px] ika-text-white" />
              <span className="ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-[0.15em] ika-text-white">
                {member.Division}
              </span>
            </div>
          </div>
        </div>

        <div className="ika-relative ika--mt-12 ika-flex ika-justify-center">
          <div className="ika-rounded-full ika-bg-white ika-p-1.5 ika-shadow-xl">
            <img
              src={photoFor(member, 240)}
              alt={member.Title}
              className={cn(
                "ika-h-24 ika-w-24 ika-rounded-full ika-object-cover ika-object-top ika-ring-[3px]",
                style.ring
              )}
            />
          </div>
        </div>

        <div className="ika-px-6 ika-pt-4 ika-text-center">
          <h2 className="ika-text-xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
            {member.Title}
          </h2>
          <p className={cn("ika-mt-1 ika-text-sm ika-font-semibold", style.text)}>
            {member.JobTitle}
          </p>
        </div>

        <div className="ika-px-6 ika-pb-8 ika-pt-8">
          <h3 className="ika-mb-5 ika-flex ika-items-center ika-gap-2 ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-[0.15em] ika-text-slate-400">
            <span className="ika-h-px ika-flex-1 ika-bg-slate-200" />
            Coordonnées
            <span className="ika-h-px ika-flex-1 ika-bg-slate-200" />
          </h3>
          <div className="ika-space-y-3">
            {coordinates.map((row) => (
              <div
                key={row.label}
                className={cn(
                  "ika-flex ika-items-center ika-gap-4 ika-rounded-xl ika-border ika-p-4 ika-transition-colors hover:ika-bg-slate-50",
                  style.border
                )}
              >
                <div className={cn("ika-flex ika-h-10 ika-w-10 ika-shrink-0 ika-items-center ika-justify-center ika-rounded-xl", style.bg)}>
                  <Icon name={row.icon} className={cn("ika-h-4 ika-w-4", style.text)} />
                </div>
                <div className="ika-min-w-0 ika-text-left">
                  <p className="ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-400">
                    {row.label}
                  </p>
                  {row.href ? (
                    <a href={row.href} className="ika-block ika-truncate ika-text-sm ika-font-semibold ika-text-slate-800 hover:ika-underline">
                      {row.value}
                    </a>
                  ) : (
                    <p className="ika-truncate ika-text-sm ika-font-semibold ika-text-slate-800">
                      {row.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
