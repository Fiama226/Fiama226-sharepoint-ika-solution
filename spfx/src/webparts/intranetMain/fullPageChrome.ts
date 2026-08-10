/**
 * Plein écran type « Coris » : supprime le chrome SharePoint autour de la
 * Web Part Intranet afin qu'elle remplisse toute la page (header/footer de
 * page, barres d'édition web part, pied de page de zone…).
 *
 * Injecte une <style> globale + un MutationObserver qui ré-applique le
 * masquage après chaque mutation du DOM SharePoint (le canvas est rendu
 * dynamiquement).
 *
 * À n'activer QUE sur une vraie page SharePoint (pas en Workbench/localhost),
 * afin de préserver l'expérience d'édition en preview.
 */

const STYLE_ID = "ika-intranet-fullpage-chrome";

const CHROME_CSS = `
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
  }
  [data-automation-id="webpartToolbar"],
  [data-automation-id="WebPartToolbar"],
  .sp-webpart-toolbar,
  [data-automation-id="CanvasZone-SectionToolbar"],
  [data-automation-id="insertSection"],
  [data-automation-id="insertZone"],
  [data-automation-id="sectionToolbar"],
  [data-automation-id="pageFooter"],
  [data-automation-id="CanvasZone-insertZone"],
  [data-automation-id="canvasFooter"],
  [data-automation-id="bottomToolbar"],
  [data-automation-id="CommentsWrapper"],
  #CommentsWrapper,
  #footer {
    display: none !important;
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
`;

const HIDE_SELECTORS = [
  '[data-automation-id="webpartToolbar"]',
  '[data-automation-id="WebPartToolbar"]',
  '.sp-webpart-toolbar',
  '[data-automation-id="CanvasZone-SectionToolbar"]',
  '[data-automation-id="insertSection"]',
  '[data-automation-id="insertZone"]',
  '[data-automation-id="sectionToolbar"]',
  '[data-automation-id="pageFooter"]',
  '[data-automation-id="canvasFooter"]',
  '[data-automation-id="bottomToolbar"]',
  '[data-automation-id="CommentsWrapper"]',
  '#CommentsWrapper',
  '#footer',
];

function hideChrome(): void {
  for (const selector of HIDE_SELECTORS) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((el) => {
      const node = el as HTMLElement;
      node.style.setProperty("display", "none", "important");
      node.style.setProperty("height", "0", "important");
      node.style.setProperty("min-height", "0", "important");
      node.style.setProperty("overflow", "hidden", "important");
    });
  }
}

export function installFullPageChrome(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.type = "text/css";
  style.textContent = CHROME_CSS;
  document.head.appendChild(style);

  hideChrome();

  // SharePoint re-rend le canvas dynamiquement : on ré-applique le masquage
  // à chaque mutation du DOM (debounce pour éviter le thrash).
  let timer: ReturnType<typeof setTimeout> | null = null;
  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      hideChrome();
    }, 150);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function isWorkbench(): boolean {
  if (typeof window === "undefined") return true;
  const path = window.location.pathname || "";
  const host = window.location.hostname || "";
  return /workbench/i.test(path) || host === "localhost" || host === "127.0.0.1";
}
