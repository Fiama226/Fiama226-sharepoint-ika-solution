import * as React from "react";

import { IOrgNode } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { divisionStyle } from "../../../common/utils/divisionStyle";
import {
  buildImageUrl,
  buildUserPhotoUrl,
  cn,
} from "../../../common/utils/spUtils";

export interface IOrgNodeCardProps {
  node: IOrgNode;
  isRoot: boolean;
  matched: boolean;
  dimmed: boolean;
  collapsed: boolean;
  onSelect: (node: IOrgNode) => void;
  onToggle: (id: number) => void;
}

function photoFor(node: IOrgNode, size: number): string {
  if (node.Photo) {
    const fromList = buildImageUrl(node.Photo, size);
    if (fromList) return fromList;
  }
  return buildUserPhotoUrl(node.Email, "M");
}

export const OrgNodeCard: React.FC<IOrgNodeCardProps> = (props) => {
  const { node, isRoot, matched, dimmed, collapsed, onSelect, onToggle } =
    props;

  const style = divisionStyle(node.Division);
  const childCount = node.children.length;
  const avatarSize = isRoot ? "ika-h-20 ika-w-20" : "ika-h-14 ika-w-14";

  return (
    <div
      className={cn(
        "ika-relative ika-transition-opacity ika-duration-300",
        dimmed && "ika-opacity-30"
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(node)}
        aria-label={`Voir le profil de ${node.Title}`}
        className={cn(
          "ika-group ika-relative ika-flex ika-flex-col ika-items-center ika-overflow-hidden ika-rounded-2xl ika-border ika-bg-white ika-text-center ika-transition-all ika-duration-200",
          "hover:-ika-translate-y-1 hover:ika-shadow-xl",
          "focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-cyan",
          isRoot ? "ika-w-64 ika-shadow-lg" : "ika-w-52 ika-shadow-sm",
          matched
            ? "ika-border-brand-cyan ika-ring-2 ika-ring-brand-cyan/40"
            : style.border
        )}
      >
        <div
          className={cn(
            "ika-h-14 ika-w-full ika-bg-gradient-to-br",
            style.gradient
          )}
        />

        <div className="ika--mt-9 ika-rounded-full ika-bg-white ika-p-1 ika-shadow-md">
          <img
            src={photoFor(node, isRoot ? 240 : 160)}
            alt=""
            loading="lazy"
            className={cn(
              "ika-rounded-full ika-object-cover ika-object-top ika-ring-2",
              avatarSize,
              style.ring
            )}
          />
        </div>

        <div className="ika-w-full ika-px-4 ika-pb-4 ika-pt-2">
          <h3
            className={cn(
              "ika-truncate ika-font-bold ika-tracking-tight ika-text-brand-navy",
              isRoot ? "ika-text-base" : "ika-text-sm"
            )}
          >
            {node.Title}
          </h3>
          <p className="ika-mt-0.5 ika-truncate ika-text-xs ika-text-slate-500">
            {node.JobTitle}
          </p>

          <span
            className={cn(
              "ika-mt-2 ika-inline-flex ika-max-w-full ika-items-center ika-gap-1 ika-rounded-full ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold",
              style.bg,
              style.text
            )}
          >
            <Icon name={style.icon} className="ika-h-3 ika-w-3 ika-shrink-0" />
            <span className="ika-truncate">{node.Division}</span>
          </span>
        </div>
      </button>

      {childCount > 0 ? (
        <button
          type="button"
          onClick={() => onToggle(node.Id)}
          aria-expanded={!collapsed}
          aria-label={
            collapsed
              ? `Déplier l'équipe de ${node.Title} (${childCount})`
              : `Replier l'équipe de ${node.Title}`
          }
          className={cn(
            "ika-absolute ika--bottom-3 ika-left-1/2 ika-z-10 ika--translate-x-1/2",
            "ika-flex ika-items-center ika-gap-1 ika-rounded-full ika-border ika-border-slate-200",
            "ika-bg-white ika-px-2.5 ika-py-1 ika-text-[11px] ika-font-bold ika-text-slate-600 ika-shadow-md",
            "ika-transition-colors hover:ika-border-brand-cyan hover:ika-text-brand-cyan",
            "focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-cyan"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
            className={cn(
              "ika-h-3 ika-w-3 ika-transition-transform",
              collapsed ? "" : "ika-rotate-180"
            )}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {childCount}
        </button>
      ) : null}
    </div>
  );
};
