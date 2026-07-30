import * as React from "react";

import { IQuickLinksProps } from "./IQuickLinksProps";
import { Icon } from "../../../common/utils/Icon";
import { cn, resolveUrl } from "../../../common/utils/spUtils";

const COLUMN_CLASSES: Record<number, string> = {
  1: "",
  2: "sm:ika-grid-cols-2",
  3: "sm:ika-grid-cols-2 lg:ika-grid-cols-3",
  4: "sm:ika-grid-cols-2 lg:ika-grid-cols-4",
};

const Skeleton: React.FC<{ columns: number }> = (props) => (
  <ul
    className={cn(
      "ika-mt-4 ika-grid ika-gap-3 ika-animate-pulse",
      COLUMN_CLASSES[props.columns] || COLUMN_CLASSES[3]
    )}
    aria-hidden="true"
  >
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <li
        key={index}
        className="ika-flex ika-items-start ika-gap-3 ika-rounded-lg ika-border ika-border-brand-line ika-bg-white ika-p-4"
      >
        <span className="ika-h-10 ika-w-10 ika-shrink-0 ika-rounded-md ika-bg-slate-200" />
        <span className="ika-min-w-0 ika-flex-1 ika-space-y-2">
          <span className="ika-block ika-h-4 ika-w-2/3 ika-rounded ika-bg-slate-200" />
          <span className="ika-block ika-h-3 ika-w-full ika-rounded ika-bg-slate-100" />
        </span>
      </li>
    ))}
  </ul>
);

export const QuickLinks: React.FC<IQuickLinksProps> = (props) => {
  const { title, links, loading, error, columns } = props;

  if (loading) {
    return (
      <div className="ika-root">
        <section aria-busy="true">
          <h2 className="ika-text-lg ika-font-semibold ika-text-brand-navy">
            {title}
          </h2>
          <Skeleton columns={columns} />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ika-root">
        <div
          role="alert"
          className="ika-rounded-lg ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="ika-root">
        <section>
          <h2 className="ika-text-lg ika-font-semibold ika-text-brand-navy">
            {title}
          </h2>
          <div className="ika-mt-4 ika-rounded-lg ika-border ika-border-dashed ika-border-brand-line ika-bg-white ika-p-8 ika-text-center">
            <p className="ika-text-sm ika-text-brand-muted">
              Aucun lien configuré. Ajoutez des éléments dans la liste
              «&nbsp;Liens rapides&nbsp;».
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ika-root">
      <section aria-labelledby="ika-quick-links-title">
        <h2
          id="ika-quick-links-title"
          className="ika-text-lg ika-font-semibold ika-text-brand-navy"
        >
          {title}
        </h2>

        <ul
          className={cn(
            "ika-mt-4 ika-grid ika-gap-3",
            COLUMN_CLASSES[columns] || COLUMN_CLASSES[3]
          )}
        >
          {links.map((link) => (
            <li key={link.Id}>
              <a
                href={resolveUrl(link.LinkUrl)}
                data-interception={link.OpenInNewTab ? undefined : "propagate"}
                target={link.OpenInNewTab ? "_blank" : undefined}
                rel={link.OpenInNewTab ? "noopener noreferrer" : undefined}
                className={cn(
                  "ika-group ika-flex ika-h-full ika-items-start ika-gap-3",
                  "ika-rounded-lg ika-border ika-border-brand-line ika-bg-white ika-p-4",
                  "ika-transition-all hover:-ika-translate-y-0.5",
                  "hover:ika-border-brand-cyan hover:ika-shadow-sm",
                  "focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-cyan"
                )}
              >
                <span
                  className={cn(
                    "ika-grid ika-h-10 ika-w-10 ika-shrink-0 ika-place-items-center",
                    "ika-rounded-md ika-bg-brand-surface ika-text-brand-navy",
                    "ika-transition-colors group-hover:ika-bg-brand-cyan group-hover:ika-text-white"
                  )}
                >
                  <Icon name={link.IconName} className="ika-h-5 ika-w-5" />
                </span>

                <span className="ika-min-w-0">
                  <span className="ika-block ika-font-medium ika-text-brand-ink group-hover:ika-text-brand-navy">
                    {link.Title}
                  </span>
                  {link.LinkDescription ? (
                    <span className="ika-mt-0.5 ika-block ika-text-sm ika-text-brand-muted">
                      {link.LinkDescription}
                    </span>
                  ) : null}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
