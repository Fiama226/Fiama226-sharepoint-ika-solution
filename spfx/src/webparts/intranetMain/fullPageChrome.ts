/**
 * Chrome de page « full bleed » pour la page dédiée à l'intranet.
 *
 * SharePoint ajoute toujours un conteneur de canvas, une largeur maximale et
 * parfois le titre de page autour d'une Web Part. Ces règles ne concernent
 * que la page de l'intranet et sont installées uniquement en lecture : le
 * mode édition garde donc tout son chrome SharePoint.
 */

const STYLE_ID = "ika-intranet-fullpage-chrome";

const CHROME_CSS = `
  /* La Web Part doit être le seul contenu de la page : pas de colonne, de
     gouttière ou de largeur maximale imposée par le canvas moderne. */
  html:has(.ika-intranet-page),
  body:has(.ika-intranet-page),
  body:has(.ika-intranet-page) #contentBox,
  body:has(.ika-intranet-page) #DeltaSPPageContentArea,
  body:has(.ika-intranet-page) #spPageCanvasContent,
  body:has(.ika-intranet-page) .CanvasZone,
  body:has(.ika-intranet-page) .CanvasSection,
  body:has(.ika-intranet-page) .ControlZone,
  body:has(.ika-intranet-page) .ms-webpart-zone,
  body:has(.ika-intranet-page) .ms-webpart-cell,
  body:has(.ika-intranet-page) .webPartContainer {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
  }

  /* Les espaces réservés à gauche/droite du canvas sont une source
     fréquente de bandes blanches sur SharePoint moderne. */
  body:has(.ika-intranet-page) [data-automation-id="CanvasZone"],
  body:has(.ika-intranet-page) [data-automation-id="CanvasSection"],
  body:has(.ika-intranet-page) [data-automation-id="CanvasControl"] {
    margin: 0 !important;
    padding: 0 !important;
    max-width: none !important;
  }

  /* Titre, image de couverture et commentaires de la page SharePoint : ils
     font doublon avec le header/hero IKA. On ne touche pas à la barre globale
     Microsoft 365 ni au mode édition. */
  body:has(.ika-intranet-page) [data-automation-id="pageHeader"],
  body:has(.ika-intranet-page) [data-automation-id="pageHeaderTitle"],
  body:has(.ika-intranet-page) #CommentsWrapper,
  body:has(.ika-intranet-page) [data-automation-id="pageFooter"] {
    display: none !important;
  }

  /* Ancien canvas/classic SharePoint */
  body:has(.ika-intranet-page) #contentBox {
    margin-left: 0 !important;
    left: 0 !important;
  }
  body:has(.ika-intranet-page) #sideNavBox,
  body:has(.ika-intranet-page) #DeltaTopNavigation,
  body:has(.ika-intranet-page) #DeltaSuiteNavigation,
  body:has(.ika-intranet-page) .sp-pageLayout-pageFooter,
  body:has(.ika-intranet-page) .sp-pageLayout-spacer {
    display: none !important;
  }

  /* Pas de marge automatique sur la racine : le hero et le footer touchent
     les bords de la fenêtre comme dans la maquette Next.js. */
  body:has(.ika-intranet-page) .ika-intranet-page {
    display: block !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  @media (max-width: 640px) {
    body:has(.ika-intranet-page) .CanvasSection,
    body:has(.ika-intranet-page) [data-automation-id="CanvasSection"] {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`;

function isEditMode(): boolean {
  if (typeof window === "undefined") return false;
  const search = window.location.search || "";
  const href = window.location.href || "";
  if (/Mode=Edit/i.test(search) || /Mode=Edit/i.test(href)) return true;
  return (
    document.querySelector(
      '.sp-pageLayout-editToolbar, [data-automation-id="CanvasZone-SectionToolbar"], [data-automation-id="pageHeader-editButton"]'
    ) !== null
  );
}

export function installFullPageChrome(): void {
  if (typeof document === "undefined" || isEditMode()) return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.type = "text/css";
  style.textContent = CHROME_CSS;
  document.head.appendChild(style);
}

export function isWorkbench(): boolean {
  if (typeof window === "undefined") return true;
  const path = window.location.pathname || "";
  const host = window.location.hostname || "";
  return /workbench/i.test(path) || host === "localhost" || host === "127.0.0.1";
}
