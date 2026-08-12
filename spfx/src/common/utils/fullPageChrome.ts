/**
 * Plein écran type « Coris » : masque le chrome SharePoint moderne
 * (suite bar, app bar, header de site, navigation gauche, titre de page)
 * pour que la Web Part Intranet occupe tout le viewport.
 *
 * Activé sur les pages SharePoint en lecture ET sur le workbench hébergé.
 * Désactivé uniquement en mode édition d'une page moderne, pour garder
 * les outils d'édition SharePoint.
 */

const STYLE_ID = "ika-intranet-fullpage-chrome";

const CHROME_CSS = `
  /* —— Microsoft 365 / SharePoint chrome —— */
  #SuiteNavWrapper,
  #SuiteNavPlaceHolder,
  #suiteBarDelta,
  #s4-ribbonrow,
  #s4-titlerow,
  #sideNavBox,
  #DeltaTopNavigation,
  #DeltaSuiteNavigation,
  #spSiteHeader,
  #spCommandBar,
  #spLeftNav,
  #sp-appBar,
  #CommentsWrapper,
  .sp-appBar,
  .spAppBar,
  .od-SuiteNav,
  .commandBarWrapper,
  .sp-pageLayout-header,
  .sp-pageLayout-pageFooter,
  .sp-pageLayout-spacer,
  [data-automation-id="SiteHeader"],
  [data-automation-id="HubNav"],
  [data-automation-id="quickLaunch"],
  [data-automation-id="sideNav"],
  [data-automation-id="pageHeader"],
  [data-automation-id="titleRegion"],
  [data-automation-id="pageFooter"],
  [data-automation-id="SimpleFooter"],
  [data-sp-feature-tag="Title region"] {
    display: none !important;
    height: 0 !important;
    min-height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
  }

  /* Contenu : plus de marge pour l'app bar / le titre */
  #sp-appBar + *,
  .spAppAndPropertyPanelContainer,
  .SPPageChrome,
  .SPPageChrome-app,
  #spPageCanvasContent,
  div[data-automation-id="contentScrollRegion"] {
    margin: 0 !important;
    margin-left: 0 !important;
    padding: 0 !important;
    padding-left: 0 !important;
    left: 0 !important;
    top: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }

  /* Canvas moderne + workbench : pleine largeur, zéro padding */
  #contentBox,
  #DeltaSPPageContentArea,
  #workbenchPageContent,
  .CanvasComponent,
  .CanvasZone,
  .CanvasSection,
  .ControlZone,
  .ControlZone--control,
  [data-automation-id="CanvasZone"],
  [data-automation-id="CanvasSection"] {
    margin: 0 !important;
    padding: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }

  html, body {
    overflow-x: hidden;
  }
`;

function isWorkbench(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname || "";
  const host = window.location.hostname || "";
  return /workbench/i.test(path) || host === "localhost" || host === "127.0.0.1";
}

function isSharePointPageEditMode(): boolean {
  if (typeof window === "undefined") return false;
  // Le workbench n'est pas une page moderne en Mode=Edit
  if (isWorkbench()) return false;

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
  if (isSharePointPageEditMode()) {
    removeFullPageChrome();
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

export { isWorkbench };
