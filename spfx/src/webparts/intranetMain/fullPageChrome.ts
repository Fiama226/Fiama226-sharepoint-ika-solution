/**
 * Plein écran type « Coris » : adapte le chrome SharePoint autour de la
 * Web Part Intranet afin qu'elle remplisse harmonieusement la page.
 *
 * À n'activer QUE sur une vraie page SharePoint en mode LECTURE (pas en mode
 * ÉDITION ni en Workbench/localhost), afin de préserver l'expérience
 * d'édition et la création de page SharePoint.
 */

const STYLE_ID = "ika-intranet-fullpage-chrome";

const CHROME_CSS = `
  /* Suppression des marges pour un affichage pleine largeur fluide */
  #contentBox {
    margin-left: 0 !important;
    padding: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }
  #DeltaSPPageContentArea {
    padding: 0 !important;
  }
  [data-automation-id="Canvas"],
  [data-automation-id="CanvasZone"],
  [data-automation-id="CanvasSection"],
  [data-automation-id="CanvasControl"],
  .ControlZone {
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }
  #sideNavBox,
  #spLeftNav,
  #s4-leftpanel,
  #s4-ribbonrow,
  #s4-titlerow,
  #suiteBarDelta,
  .ms-compositeHeader,
  [data-automation-id="quickLaunch"],
  [data-automation-id="sideNav"],
  #DeltaTopNavigation,
  #DeltaSuiteNavigation,
  .sp-pageLayout-pageFooter,
  .sp-pageLayout-spacer {
    display: none !important;
  }
  [data-automation-id="pageHeader"],
  [data-automation-id="pageFooter"],
  #CommentsWrapper {
    display: none !important;
  }
`;

function isEditMode(): boolean {
  if (typeof window === "undefined") return false;
  const search = window.location.search || "";
  const href = window.location.href || "";
  if (/Mode=Edit/i.test(search) || /Mode=Edit/i.test(href)) {
    return true;
  }
  if (
    document.querySelector(
      '.sp-pageLayout-editToolbar, [data-automation-id="CanvasZone-SectionToolbar"], [data-automation-id="pageHeader-editButton"]'
    ) !== null
  ) {
    return true;
  }
  return false;
}

export function installFullPageChrome(): void {
  if (typeof document === "undefined") return;
  if (isEditMode()) {
    // Ne jamais masquer les barres d'édition SharePoint en mode édition
    return;
  }

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.type = "text/css";
    style.textContent = CHROME_CSS;
    document.head.appendChild(style);
  }
}

export function removeFullPageChrome(): void {
  if (typeof document === "undefined") return;
  const style = document.getElementById(STYLE_ID);
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }
}

export function isWorkbench(): boolean {
  if (typeof window === "undefined") return true;
  const path = window.location.pathname || "";
  const host = window.location.hostname || "";
  return /workbench/i.test(path) || host === "localhost" || host === "127.0.0.1";
}
