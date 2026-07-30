import * as React from "react";

import { IPageHeaderProps } from "./IPageHeaderProps";

export const PageHeader: React.FC<IPageHeaderProps> = (props) => {
  const { title, description, breadcrumb } = props;

  return (
    <div className="ika-root">
      <section className="ika-relative ika-overflow-hidden ika-bg-brand-navy ika-text-white">
        <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-10 sm:ika-px-6 lg:ika-px-8">
          {breadcrumb.length > 0 ? (
            <nav
              aria-label="Fil d'Ariane"
              className="ika-mb-3 ika-text-sm ika-text-white/70"
            >
              <ol className="ika-flex ika-flex-wrap ika-items-center ika-gap-1">
                {breadcrumb.map((crumb, index) => {
                  const isLast = index === breadcrumb.length - 1;

                  return (
                    <li
                      key={`${crumb.label}-${index}`}
                      className="ika-flex ika-items-center ika-gap-1"
                    >
                      {crumb.url && !isLast ? (
                        <a
                          href={crumb.url}
                          data-interception="propagate"
                          className="hover:ika-text-white hover:ika-underline"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span
                          className={isLast ? "ika-text-white" : undefined}
                          aria-current={isLast ? "page" : undefined}
                        >
                          {crumb.label}
                        </span>
                      )}
                      {!isLast ? <span aria-hidden="true">/</span> : null}
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}

          <h1 className="ika-text-3xl ika-font-bold ika-tracking-tight sm:ika-text-4xl">
            {title}
          </h1>

          {description ? (
            <p className="ika-mt-3 ika-max-w-2xl ika-text-base ika-text-white/80">
              {description}
            </p>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="ika-pointer-events-none ika-absolute -ika-right-16 -ika-top-16 ika-h-56 ika-w-56 ika-rounded-full ika-bg-brand-cyan/20 ika-blur-2xl"
        />
      </section>
    </div>
  );
};
