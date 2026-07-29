import * as React from "react";

import { IIkaHeaderProps, INavNode } from "../../../models/IChromeModels";
import { Icon } from "../../../common/utils/Icon";
import { useClickOutside } from "../../../common/hooks/useClickOutside";
import { cn } from "../../../common/utils/spUtils";

function isActive(nodeUrl: string, currentPath: string): boolean {
  if (!nodeUrl) return false;
  const target = nodeUrl.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
  const current = currentPath.replace(/\/$/, "");
  if (!target) return false;
  return current === target || current.indexOf(`${target}/`) === 0;
}

const NavLink: React.FC<{
  node: INavNode;
  currentPath: string;
  onNavigate?: () => void;
  variant: "primary" | "secondary" | "mobile";
}> = (props) => {
  const { node, currentPath, onNavigate, variant } = props;
  const active = isActive(node.url, currentPath);

  const classes =
    variant === "secondary"
      ? cn(
          "ika-flex ika-items-center ika-gap-1.5 ika-transition-colors",
          active
            ? "ika-font-medium ika-text-brand-navy"
            : "ika-text-slate-500 hover:ika-text-brand-cyan-dark"
        )
      : variant === "mobile"
        ? cn(
            "ika-flex ika-items-center ika-gap-3 ika-rounded-lg ika-px-3 ika-py-2.5",
            "ika-text-sm ika-font-medium ika-transition-colors",
            active
              ? "ika-bg-brand-surface ika-text-brand-navy"
              : "ika-text-slate-700 hover:ika-bg-slate-50"
          )
        : cn(
            "ika-flex ika-items-center ika-gap-2 ika-rounded-lg ika-px-3 ika-py-2",
            "ika-text-sm ika-font-medium ika-transition-colors",
            active
              ? "ika-bg-brand-surface ika-text-brand-navy"
              : "ika-text-slate-600 hover:ika-bg-slate-100 hover:ika-text-brand-navy"
          );

  return (
    <a
      href={node.url}
      data-interception="propagate"
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={classes}
    >
      <Icon
        name={node.iconName}
        className={variant === "secondary" ? "ika-h-3.5 ika-w-3.5" : "ika-h-5 ika-w-5"}
      />
      <span>{node.label}</span>
    </a>
  );
};

export const IkaHeader: React.FC<IIkaHeaderProps> = (props) => {
  const {
    context,
    primaryNav,
    secondaryNav,
    showSearch,
    showDocumentsMenu,
    documentsNav,
  } = props;

  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const [profileOpen, setProfileOpen] = React.useState<boolean>(false);
  const [docsOpen, setDocsOpen] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>("");
  const [photoFailed, setPhotoFailed] = React.useState<boolean>(false);

  const profileRef = useClickOutside<HTMLDivElement>(
    () => setProfileOpen(false),
    profileOpen
  );
  const docsRef = useClickOutside<HTMLDivElement>(
    () => setDocsOpen(false),
    docsOpen
  );

  const submitSearch = (event: React.FormEvent): void => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    window.location.href = `${context.hubUrl}/_layouts/15/search.aspx/siteall?q=${encodeURIComponent(term)}`;
  };

  const initials = context.currentUser.displayName
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const avatar =
    context.currentUser.photoUrl && !photoFailed ? (
      <img
        src={context.currentUser.photoUrl}
        alt=""
        onError={() => setPhotoFailed(true)}
        className="ika-h-8 ika-w-8 ika-rounded-full ika-object-cover"
      />
    ) : (
      <span
        aria-hidden="true"
        className="ika-grid ika-h-8 ika-w-8 ika-place-items-center ika-rounded-full ika-bg-brand-navy ika-text-xs ika-font-semibold ika-text-white"
      >
        {initials}
      </span>
    );

  return (
    <div className="ika-root">
      <header className="ika-w-full ika-border-b ika-border-slate-200 ika-bg-white">
        <div className="ika-mx-auto ika-max-w-7xl">
          {secondaryNav.length > 0 ? (
            <div className="ika-hidden ika-h-10 ika-items-center ika-justify-end ika-gap-6 ika-border-b ika-border-slate-100 ika-bg-slate-50/60 ika-px-6 ika-text-sm lg:ika-flex">
              <nav aria-label="Navigation secondaire" className="ika-flex ika-items-center ika-gap-6">
                {secondaryNav.map((node) => (
                  <NavLink
                    key={node.key}
                    node={node}
                    currentPath={context.currentPath}
                    variant="secondary"
                  />
                ))}
              </nav>
            </div>
          ) : null}

          <div className="ika-flex ika-h-16 ika-items-center ika-justify-between ika-gap-4 ika-px-4 sm:ika-px-6 lg:ika-px-8">
            <div className="ika-flex ika-min-w-0 ika-items-center ika-gap-6">
              <a
                href={context.hubUrl}
                data-interception="propagate"
                className="ika-flex-shrink-0"
              >
                <span className="ika-sr-only">IKA Solution — Accueil</span>
                <img
                  src={context.logoUrl}
                  alt="IKA Solution"
                  className="ika-h-10 ika-w-auto ika-object-contain"
                />
              </a>

              <nav
                aria-label="Navigation principale"
                className="ika-hidden ika-items-center ika-gap-1 lg:ika-flex"
              >
                {primaryNav.map((node) => (
                  <NavLink
                    key={node.key}
                    node={node}
                    currentPath={context.currentPath}
                    variant="primary"
                  />
                ))}
              </nav>
            </div>

            <div className="ika-flex ika-items-center ika-gap-2">
              {showSearch ? (
                <form
                  onSubmit={submitSearch}
                  role="search"
                  className="ika-relative ika-hidden md:ika-flex ika-items-center"
                >
                  <span className="ika-pointer-events-none ika-absolute ika-left-3 ika-text-slate-400">
                    <Icon name="target" className="ika-h-4 ika-w-4" />
                  </span>
                  <label htmlFor="ika-search" className="ika-sr-only">
                    Rechercher dans l&apos;intranet
                  </label>
                  <input
                    id="ika-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="ika-w-56 ika-rounded-full ika-border ika-border-transparent ika-bg-slate-100 ika-py-2 ika-pl-9 ika-pr-3 ika-text-sm ika-outline-none ika-transition-all focus:ika-border-brand-cyan focus:ika-bg-white lg:ika-w-64"
                  />
                </form>
              ) : null}

              {showDocumentsMenu && documentsNav.length > 0 ? (
                <div className="ika-relative" ref={docsRef}>
                  <button
                    type="button"
                    onClick={() => setDocsOpen(!docsOpen)}
                    aria-expanded={docsOpen}
                    aria-haspopup="true"
                    className={cn(
                      "ika-flex ika-items-center ika-gap-2 ika-rounded-lg ika-px-3 ika-py-2",
                      "ika-text-sm ika-font-medium ika-transition-colors",
                      docsOpen
                        ? "ika-bg-brand-surface ika-text-brand-navy"
                        : "ika-text-slate-600 hover:ika-bg-slate-100"
                    )}
                  >
                    <Icon name="FolderOpen" className="ika-h-4 ika-w-4" />
                    <span className="ika-hidden xl:ika-inline">Documents</span>
                  </button>

                  {docsOpen ? (
                    <div className="ika-absolute ika-right-0 ika-z-50 ika-mt-2 ika-w-72 ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2 ika-shadow-lg">
                      <p className="ika-border-b ika-border-slate-100 ika-px-4 ika-py-2 ika-text-xs ika-font-semibold ika-uppercase ika-tracking-wider ika-text-slate-500">
                        Bibliothèques
                      </p>
                      {documentsNav.map((node) => (
                        <a
                          key={node.key}
                          href={node.url}
                          data-interception="propagate"
                          onClick={() => setDocsOpen(false)}
                          className="ika-flex ika-items-center ika-gap-3 ika-px-4 ika-py-2.5 ika-text-sm ika-text-slate-700 ika-transition-colors hover:ika-bg-brand-surface hover:ika-text-brand-navy"
                        >
                          <span className="ika-grid ika-h-7 ika-w-7 ika-place-items-center ika-rounded-lg ika-bg-brand-surface ika-text-brand-navy">
                            <Icon name={node.iconName} className="ika-h-4 ika-w-4" />
                          </span>
                          <span className="ika-font-medium">{node.label}</span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="ika-relative ika-hidden md:ika-block" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  className="ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-border ika-border-slate-200 ika-p-1 ika-pr-2 ika-transition-colors hover:ika-bg-slate-100"
                >
                  {avatar}
                  <span className="ika-sr-only">Menu utilisateur</span>
                  <Icon name="tag" className="ika-h-3 ika-w-3 ika-text-slate-500" />
                </button>

                {profileOpen ? (
                  <div className="ika-absolute ika-right-0 ika-z-50 ika-mt-2 ika-w-60 ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2 ika-shadow-lg">
                    <div className="ika-border-b ika-border-slate-100 ika-px-4 ika-py-3">
                      <p className="ika-truncate ika-text-sm ika-font-semibold ika-text-brand-ink">
                        {context.currentUser.displayName}
                      </p>
                      <p className="ika-truncate ika-text-xs ika-text-slate-500">
                        {context.currentUser.email}
                      </p>
                    </div>
                    <a
                      href={`https://delve.office.com/?u=${encodeURIComponent(context.currentUser.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ika-block ika-px-4 ika-py-2 ika-text-sm ika-text-slate-700 ika-transition-colors hover:ika-bg-slate-50"
                    >
                      Mon profil
                    </a>
                    {context.currentUser.isSiteAdmin ? (
                      <a
                        href={`${context.siteUrl}/_layouts/15/settings.aspx`}
                        className="ika-block ika-px-4 ika-py-2 ika-text-sm ika-text-slate-700 ika-transition-colors hover:ika-bg-slate-50"
                      >
                        Paramètres du site
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                className="ika-rounded-lg ika-p-2 ika-text-slate-600 ika-transition-colors hover:ika-bg-slate-100 lg:ika-hidden"
              >
                <Icon name={menuOpen ? "link" : "admin"} className="ika-h-6 ika-w-6" />
              </button>
            </div>
          </div>

          {menuOpen ? (
            <div className="ika-border-t ika-border-slate-200 ika-bg-white ika-px-4 ika-py-4 lg:ika-hidden">
              <nav aria-label="Navigation mobile" className="ika-space-y-1">
                {primaryNav.map((node) => (
                  <NavLink
                    key={node.key}
                    node={node}
                    currentPath={context.currentPath}
                    variant="mobile"
                    onNavigate={() => setMenuOpen(false)}
                  />
                ))}
              </nav>

              {secondaryNav.length > 0 ? (
                <>
                  <hr className="ika-my-3 ika-border-slate-100" />
                  <p className="ika-mb-1 ika-px-3 ika-text-xs ika-font-semibold ika-uppercase ika-tracking-wider ika-text-slate-400">
                    Ressources
                  </p>
                  <nav className="ika-space-y-1">
                    {secondaryNav.map((node) => (
                      <NavLink
                        key={node.key}
                        node={node}
                        currentPath={context.currentPath}
                        variant="mobile"
                        onNavigate={() => setMenuOpen(false)}
                      />
                    ))}
                  </nav>
                </>
              ) : null}

              <hr className="ika-my-3 ika-border-slate-100" />

              <div className="ika-flex ika-items-center ika-gap-3 ika-rounded-xl ika-bg-slate-50 ika-px-3 ika-py-3">
                {avatar}
                <div className="ika-min-w-0 ika-flex-1">
                  <p className="ika-truncate ika-text-sm ika-font-medium ika-text-brand-ink">
                    {context.currentUser.displayName}
                  </p>
                  <p className="ika-truncate ika-text-xs ika-text-slate-500">
                    {context.currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </header>
    </div>
  );
};
