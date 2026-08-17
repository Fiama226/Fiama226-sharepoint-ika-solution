import "../../../styles/tailwind.css";

import * as React from "react";

import { IIkaHeaderProps, INavNode } from "../../../models/IChromeModels";
import { Icon } from "../../../common/utils/Icon";
import { useClickOutside } from "../../../common/hooks/useClickOutside";
import { cn } from "../../../common/utils/spUtils";

/**
 * IkaHeader — port 1:1 du header de la maquette Next.js
 * (components/layout/site-header.tsx).
 *
 * Structure identique :
 *   - barre secondaire (navigation secondaire) sur desktop,
 *   - barre principale : logo, recherche, documents, notifications, profil,
 *   - menu mobile complet (recherche + navigation primaire + secondaire + profil).
 */

const DEPARTMENT_CHIP: {
  icon: string;
  chip: string;
}[] = [
  // Comptabilité
  { icon: "Calculator", chip: "ika-bg-blue-50 ika-text-blue-600" },
  // Administration
  { icon: "ShieldCheck", chip: "ika-bg-purple-50 ika-text-purple-600" },
  // Commerciaux
  { icon: "Users", chip: "ika-bg-green-50 ika-text-green-600" },
  // Techniciens
  { icon: "Wrench", chip: "ika-bg-orange-50 ika-text-orange-600" },
];

function isNodeActive(
  nodeUrl: string,
  currentPath: string,
  activeRoute?: string
): boolean {
  if (!nodeUrl) return false;
  if (nodeUrl.startsWith("#")) {
    const routeName = nodeUrl.replace(/^#\/?(page-)?/, "") || "accueil";
    const current = (activeRoute || "accueil").replace(/^#\/?(page-)?/, "");
    return (
      current === routeName || (routeName === "accueil" && current === "")
    );
  }
  const target = nodeUrl
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/\/$/, "");
  const current = currentPath.replace(/\/$/, "");
  if (!target) return false;
  return current === target || current.indexOf(`${target}/`) === 0;
}

const NavLink: React.FC<{
  node: INavNode;
  currentPath: string;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  variant: "primary" | "secondary" | "mobile";
}> = (props) => {
  const { node, currentPath, activeRoute, onNavigate, variant } = props;
  const active = isNodeActive(node.url, currentPath, activeRoute);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (node.url && node.url.startsWith("#")) {
      e.preventDefault();
      const route = node.url.replace(/^#\/?(page-)?/, "") || "accueil";
      window.location.hash = node.url;
      if (onNavigate) {
        onNavigate(route);
      }
    } else if (onNavigate) {
      onNavigate(node.url);
    }
  };

  const classes =
    variant === "secondary"
      ? cn(
          "ika-flex ika-items-center ika-gap-1.5 ika-transition-colors",
          active
            ? "ika-text-blue-700 ika-font-medium"
            : "ika-text-gray-500 hover:ika-text-blue-600"
        )
      : cn(
          "ika-flex ika-items-center ika-gap-3 ika-rounded-lg ika-px-3 ika-py-2.5",
          "ika-text-sm ika-font-medium ika-transition-colors",
          active
            ? "ika-bg-blue-50 ika-text-blue-700"
            : "ika-text-gray-700 hover:ika-bg-gray-50"
        );

  return (
    <a
      href={node.url}
      data-interception="propagate"
      onClick={handleClick}
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

export interface IExtendedHeaderProps extends IIkaHeaderProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

export const IkaHeader: React.FC<IExtendedHeaderProps> = (props) => {
  const {
    context,
    primaryNav,
    secondaryNav,
    showSearch,
    showDocumentsMenu,
    documentsNav,
    activeRoute,
    onNavigate,
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

  const runSearch = (): void => {
    const term = query.trim();
    if (!term) return;
    if (onNavigate) {
      onNavigate(`actualites?q=${encodeURIComponent(term)}`);
    } else {
      window.location.href = `${context.hubUrl}/_layouts/15/search.aspx/siteall?q=${encodeURIComponent(term)}`;
    }
  };

  const submitSearch = (event: React.FormEvent): void => {
    event.preventDefault();
    runSearch();
  };

  const navigateTo = (route: string): void => {
    const clean = route.replace(/^#\/?(page-)?/, "") || "accueil";
    window.location.hash = `#${clean}`;
    if (onNavigate) {
      onNavigate(clean);
    }
  };

  const initials = (context.currentUser.displayName || "IK")
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const avatar = context.currentUser.photoUrl && !photoFailed ? (
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

  const mobileAvatar = context.currentUser.photoUrl && !photoFailed ? (
    <img
      src={context.currentUser.photoUrl}
      alt=""
      onError={() => setPhotoFailed(true)}
      className="ika-h-10 ika-w-10 ika-rounded-full ika-object-cover ika-border ika-border-gray-200"
    />
  ) : (
    <span
      aria-hidden="true"
      className="ika-grid ika-h-10 ika-w-10 ika-shrink-0 ika-place-items-center ika-rounded-full ika-bg-brand-navy ika-text-sm ika-font-semibold ika-text-white"
    >
      {initials}
    </span>
  );

  return (
    <div className="ika-root" style={{ display: "contents" }}>
      <header className="ika-sticky ika-top-0 ika-z-50 ika-w-full ika-border-b ika-border-gray-200 ika-bg-white/80 ika-backdrop-blur-md">
        <div className="ika-mx-auto ika-max-w-7xl">
          {/* Barre supérieure : navigation secondaire */}
          {secondaryNav.length > 0 ? (
            <div className="ika-hidden ika-h-10 ika-items-center ika-justify-between ika-border-b ika-border-gray-100 ika-bg-gray-50/50 ika-px-6 ika-text-sm lg:ika-flex">
              <a
                href="#accueil"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("accueil");
                }}
                data-interception="propagate"
                className="ika-flex-shrink-0 ika-w-[260px]"
              >
                <span className="ika-sr-only">IKA Solution</span>
              </a>
              <nav
                aria-label="Navigation secondaire"
                className="ika-flex ika-items-center ika-gap-6"
              >
                {secondaryNav.map((node) => (
                  <NavLink
                    key={node.key}
                    node={node}
                    currentPath={context.currentPath}
                    activeRoute={activeRoute}
                    onNavigate={onNavigate}
                    variant="secondary"
                  />
                ))}
              </nav>
            </div>
          ) : null}

          {/* Barre principale */}
          <div className="ika-flex ika-h-16 ika-items-center ika-justify-between ika-px-4 sm:ika-px-6 lg:ika-px-8">
            {/* Logo */}
            <div className="ika-flex ika-items-center ika-gap-6 lg:ika-gap-8">
              <a
                href="#accueil"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("accueil");
                }}
                data-interception="propagate"
                className="ika-flex-shrink-0"
              >
                <span className="ika-sr-only">IKA Solution</span>
                <img
                  src={context.logoUrl}
                  alt="Logo IKA Solution"
                  className="ika-h-16 ika-w-auto ika-object-contain"
                />
              </a>
            </div>

            {/* Actions droite */}
            <div className="ika-flex ika-items-center ika-gap-2">
              {/* Barre de recherche */}
              {showSearch ? (
                <form
                  onSubmit={submitSearch}
                  role="search"
                  className="ika-group ika-relative ika-hidden ika-items-center md:ika-flex"
                >
                  <span className="ika-absolute ika-left-3 ika-text-gray-400 ika-transition-colors group-focus-within:ika-text-blue-600">
                    <Icon name="Search" className="ika-h-4 ika-w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Rechercher"
                    className="ika-w-56 ika-rounded-full ika-border ika-border-transparent ika-bg-gray-100 ika-py-2 ika-pl-9 ika-pr-8 ika-text-sm ika-outline-none ika-transition-all focus:ika-border-blue-500 focus:ika-bg-white focus:ika-ring-2 focus:ika-ring-blue-500/20 lg:ika-w-64"
                  />
                  <kbd className="ika-absolute ika-right-3 ika-hidden ika-rounded ika-border ika-border-gray-300 ika-bg-gray-200 ika-px-1.5 ika-py-0.5 ika-text-[10px] ika-font-semibold ika-text-gray-400 lg:ika-inline-block">
                    ⌘K
                  </kbd>
                </form>
              ) : null}

              {/* Dropdown Documents */}
              {showDocumentsMenu && documentsNav.length > 0 ? (
                <div className="ika-relative" ref={docsRef}>
                  <button
                    type="button"
                    onClick={() => setDocsOpen(!docsOpen)}
                    aria-expanded={docsOpen}
                    aria-haspopup="true"
                    className={cn(
                      "ika-flex ika-items-center ika-gap-2 ika-rounded-lg ika-px-3 ika-py-2 ika-text-sm ika-font-medium ika-transition-colors",
                      docsOpen
                        ? "ika-bg-blue-50 ika-text-blue-700"
                        : "ika-text-gray-600 hover:ika-bg-gray-100 hover:ika-text-gray-900"
                    )}
                  >
                    <Icon name="FolderOpen" className="ika-h-4 ika-w-4" />
                    <span className="ika-hidden xl:ika-inline">Documents</span>
                  </button>

                  {docsOpen ? (
                    <div className="ika-absolute ika-right-0 ika-z-50 ika-mt-2 ika-w-72 ika-rounded-xl ika-border ika-border-gray-200 ika-bg-white ika-py-2 ika-shadow-lg">
                      <div className="ika-mb-1 ika-border-b ika-border-gray-100 ika-px-4 ika-py-2">
                        <p className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-wider ika-text-gray-500">
                          Repository
                        </p>
                        <a
                          href="#documents"
                          data-interception="propagate"
                          onClick={(e) => {
                            e.preventDefault();
                            setDocsOpen(false);
                            navigateTo("documents");
                          }}
                          className="ika-mt-2 ika-inline-flex ika-items-center ika-gap-2 ika-rounded-lg ika-px-3 ika-py-2 ika-text-sm ika-font-medium ika-text-blue-600 ika-transition-colors hover:ika-bg-blue-50"
                        >
                          <Icon name="FolderOpen" className="ika-h-4 ika-w-4" />
                          Tous les documents
                        </a>
                      </div>

                      {documentsNav.map((node, index) => {
                        const cfg = DEPARTMENT_CHIP[index % DEPARTMENT_CHIP.length];
                        return (
                          <a
                            key={node.key}
                            href={node.url}
                            data-interception="propagate"
                            onClick={(e) => {
                              setDocsOpen(false);
                              if (node.url && node.url.startsWith("#")) {
                                e.preventDefault();
                                const r =
                                  node.url.replace(/^#\/?(page-)?/, "") ||
                                  "documents";
                                window.location.hash = node.url;
                                if (onNavigate) onNavigate(r);
                              }
                            }}
                            className="ika-group ika-flex ika-items-center ika-gap-3 ika-px-4 ika-py-2.5 ika-text-sm ika-text-gray-700 ika-transition-colors hover:ika-bg-blue-50 hover:ika-text-blue-700"
                          >
                            <div
                              className={cn(
                                "ika-rounded-lg ika-p-1.5 ika-transition-colors group-hover:ika-bg-white",
                                cfg.chip
                              )}
                            >
                              <Icon name={node.iconName || cfg.icon} className="ika-h-4 ika-w-4" />
                            </div>
                            <span className="ika-font-medium">{node.label}</span>
                          </a>
                        );
                      })}

                      <div className="ika-mt-2 ika-border-t ika-border-gray-100 ika-pt-2">
                        <a
                          href="#documents"
                          data-interception="propagate"
                          onClick={(e) => {
                            e.preventDefault();
                            setDocsOpen(false);
                            navigateTo("documents");
                          }}
                          className="ika-mx-2 ika-flex ika-items-center ika-justify-center ika-gap-2 ika-rounded-lg ika-px-4 ika-py-2 ika-text-sm ika-font-medium ika-text-blue-600 ika-transition-colors hover:ika-bg-blue-50"
                        >
                          <Icon name="FolderOpen" className="ika-h-4 ika-w-4" />
                          All Documents
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Notifications */}
              <button
                type="button"
                aria-label="Notifications"
                className="ika-relative ika-rounded-lg ika-p-2 ika-text-gray-500 ika-transition-colors hover:ika-bg-gray-100 hover:ika-text-gray-900"
              >
                <Icon name="Bell" className="ika-h-5 ika-w-5" />
                <span className="ika-absolute ika-right-1.5 ika-top-1.5 ika-h-2 ika-w-2 ika-rounded-full ika-border-2 ika-border-white ika-bg-red-500" />
              </button>

              {/* Profil */}
              <div className="ika-relative ika-hidden md:ika-block" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  className="ika-flex ika-items-center ika-gap-2 ika-rounded-full ika-border ika-border-gray-200 ika-p-1 ika-pr-3 ika-transition-colors hover:ika-bg-gray-100"
                >
                  {avatar}
                  <Icon
                    name="ChevronDown"
                    className={cn(
                      "ika-h-4 ika-w-4 ika-text-gray-500 ika-transition-transform ika-duration-200",
                      profileOpen ? "ika-rotate-180" : ""
                    )}
                  />
                </button>

                {profileOpen ? (
                  <div className="ika-absolute ika-right-0 ika-z-50 ika-mt-2 ika-w-56 ika-rounded-xl ika-border ika-border-gray-200 ika-bg-white ika-py-2 ika-shadow-lg">
                    <div className="ika-border-b ika-border-gray-100 ika-px-4 ika-py-3">
                      <p className="ika-truncate ika-text-sm ika-font-semibold ika-text-gray-900">
                        {context.currentUser.displayName || "Utilisateur IKA"}
                      </p>
                      <p className="ika-truncate ika-text-xs ika-text-gray-500">
                        {context.currentUser.email || "contact@ikasolution.com"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigateTo("equipe");
                      }}
                      className="ika-block ika-w-full ika-px-4 ika-py-2 ika-text-left ika-text-sm ika-text-gray-700 ika-transition-colors hover:ika-bg-gray-50 hover:ika-text-blue-700"
                    >
                      Mon profil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigateTo("faq");
                      }}
                      className="ika-block ika-w-full ika-px-4 ika-py-2 ika-text-left ika-text-sm ika-text-gray-700 ika-transition-colors hover:ika-bg-gray-50 hover:ika-text-blue-700"
                    >
                      Paramètres
                    </button>
                    <hr className="ika-my-2 ika-border-gray-100" />
                    <button
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="ika-block ika-w-full ika-px-4 ika-py-2 ika-text-left ika-text-sm ika-text-red-600 ika-transition-colors hover:ika-bg-red-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Bouton menu mobile */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                className="ika-rounded-lg ika-p-2 ika-text-gray-600 ika-transition-colors hover:ika-bg-gray-100 lg:ika-hidden"
              >
                <Icon name={menuOpen ? "X" : "Menu"} className="ika-h-6 ika-w-6" />
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          {menuOpen ? (
            <div className="ika-absolute ika-left-0 ika-right-0 ika-top-16 ika-max-h-[calc(100vh-4rem)] ika-overflow-y-auto ika-border-b ika-border-gray-200 ika-bg-white ika-shadow-xl ika-z-40 lg:ika-hidden">
              <div className="ika-space-y-4 ika-p-4">
                {/* Recherche mobile */}
                <div className="ika-relative">
                  <span className="ika-absolute ika-left-3 ika-top-1/2 ika--translate-y-1/2 ika-text-gray-400">
                    <Icon name="Search" className="ika-h-4 ika-w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        runSearch();
                      }
                    }}
                    className="ika-w-full ika-rounded-lg ika-border-transparent ika-bg-gray-100 ika-py-2.5 ika-pl-9 ika-pr-4 ika-text-sm ika-outline-none focus:ika-ring-2 focus:ika-ring-blue-500"
                  />
                </div>

                {/* Navigation principale */}
                <div className="ika-space-y-1">
                  {primaryNav.map((node) => (
                    <NavLink
                      key={node.key}
                      node={node}
                      currentPath={context.currentPath}
                      activeRoute={activeRoute}
                      variant="mobile"
                      onNavigate={(r) => {
                        setMenuOpen(false);
                        if (onNavigate) onNavigate(r);
                      }}
                    />
                  ))}
                </div>

                <hr className="ika-border-gray-100" />

                {/* Navigation secondaire */}
                {secondaryNav.length > 0 ? (
                  <div className="ika-space-y-1">
                    <p className="ika-mb-1 ika-px-3 ika-text-xs ika-font-semibold ika-uppercase ika-tracking-wider ika-text-gray-400">
                      Ressources
                    </p>
                    {secondaryNav.map((node) => (
                      <NavLink
                        key={node.key}
                        node={node}
                        currentPath={context.currentPath}
                        activeRoute={activeRoute}
                        variant="mobile"
                        onNavigate={(r) => {
                          setMenuOpen(false);
                          if (onNavigate) onNavigate(r);
                        }}
                      />
                    ))}
                  </div>
                ) : null}

                <hr className="ika-border-gray-100" />

                {/* Profil mobile */}
                <div className="ika-flex ika-items-center ika-gap-3 ika-rounded-xl ika-bg-gray-50 ika-px-3 ika-py-3">
                  {mobileAvatar}
                  <div className="ika-min-w-0 ika-flex-1">
                    <p className="ika-truncate ika-text-sm ika-font-medium ika-text-gray-900">
                      {context.currentUser.displayName || "Utilisateur IKA"}
                    </p>
                    <p className="ika-truncate ika-text-xs ika-text-gray-500">
                      {context.currentUser.email || "contact@ikasolution.com"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigateTo("equipe");
                    }}
                    className="ika-rounded-lg ika-p-2 ika-text-gray-500 ika-transition-colors hover:ika-bg-gray-200"
                    aria-label="Mon profil"
                  >
                    <Icon name="ChevronDown" className="ika-h-4 ika-w-4 ika-rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </header>
    </div>
  );
};
