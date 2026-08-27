/**
 * Prise de contrôle complète de la mise en page, façon Coris Méso Finance :
 * fait occuper au web part tout le viewport (hors barre de suite M365,
 * jamais masquable par une Web Part), quel que soit l'hôte (page SharePoint
 * réelle ou Workbench).
 *
 * Contrairement à une feuille de style basée sur des sélecteurs devinés
 * (fragile : les classes internes du canvas SharePoint changent d'une mise
 * à jour à l'autre, et sont parfois hachées au build), cette version :
 *   1. positionne le web part lui-même en `position: fixed`, décalé
 *      uniquement de la hauteur RÉELLEMENT MESURÉE de la barre de suite ;
 *   2. remonte la VRAIE chaîne de parents DOM du web part (pas des noms de
 *      classe devinés) pour leur retirer toute contrainte de largeur ;
 *   3. masque tout ce qui suit la section du web part dans le canvas ;
 *   4. ré-applique tout ça via un MutationObserver à chaque re-rendu de
 *      SharePoint (son canvas React interne peut réinitialiser les styles
 *      inline à tout moment).
 *
 * Choix assumé : si la page est ouverte en mode ÉDITION (`?Mode=Edit`), on
 * quitte immédiatement ce mode (redirection) plutôt que de cohabiter avec la
 * barre Save/Discard — ce web part est pensé comme une page « app », pas
 * comme un canvas éditable section par section.
 */

const STYLE_ID = "ika-intranet-fullpage-style";

const STATIC_CSS = `
  [data-automation-id="webpartToolbar"],
  [data-automation-id="WebPartToolbar"],
  [data-automation-id="CanvasZone-SectionToolbar"],
  [data-automation-id="insertSection"],
  [data-automation-id="insertZone"],
  [data-automation-id="sectionToolbar"],
  [data-automation-id="canvasFooter"],
  [data-automation-id="bottomToolbar"],
  .sp-webpart-toolbar,
  [class*="webpartToolbar_"],
  [class*="WebPartToolbar_"],
  [class*="sectionToolbar_"],
  [class*="toolbarContainer_"],
  [class*="editMenuButton_"],
  [class*="commandBar_"] {
    display: none !important;
    pointer-events: none !important;
  }
`;

/**
 * Conteneur monté DIRECTEMENT sur <body>.
 *
 * Pourquoi : tant que le web part vit à l'intérieur du canvas SharePoint, il
 * reste soumis à ce que le canvas impose à SES ANCÊTRES — largeur maximale,
 * `overflow: hidden`, et surtout `transform`/`filter`/`contain`, qui font de
 * l'ancêtre concerné le BLOC CONTENEUR d'un élément `position: fixed` (le
 * `fixed` cesse alors d'être relatif au viewport et se retrouve rogné dans la
 * boîte du canvas — c'est le cas dans le Workbench).
 *
 * `applyLayout()` tentait de neutraliser ces contraintes ancêtre par ancêtre :
 * course perdue d'avance, le canvas étant piloté par React et réappliquant ses
 * propres styles. On sort donc de l'arbre : `<body>` n'a ni largeur maximale,
 * ni rognage, ni transform — il ne reste rien pour contraindre le contenu.
 *
 * Bénéfice décisif ici : le comportement devient IDENTIQUE en Workbench et sur
 * une vraie page, alors que leurs canvas respectifs n'ont aucun DOM commun.
 */
const HOST_ID = "ika-intranet-fullpage-host";

let observer: MutationObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** Crée (ou récupère) le conteneur plein écran monté sur <body>. */
export function ensureFullPageHost(): HTMLElement {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement("div");
    host.id = HOST_ID;
    document.body.appendChild(host);
  } else if (host.parentElement !== document.body) {
    // Le canvas React a pu ré-parenter le nœud lors d'un re-rendu.
    document.body.appendChild(host);
  }
  return host;
}

/**
 * Réduit à zéro l'emplacement d'origine du web part dans le canvas : le
 * contenu vit désormais dans le host, l'emplacement ne doit plus réserver
 * de hauteur ni afficher de fond.
 */
function collapsePlaceholder(domElement: HTMLElement): void {
  domElement.style.setProperty("height", "0", "important");
  domElement.style.setProperty("min-height", "0", "important");
  domElement.style.setProperty("margin", "0", "important");
  domElement.style.setProperty("padding", "0", "important");
  domElement.style.setProperty("overflow", "hidden", "important");
}

/**
 * Si la page est ouverte en mode édition, on en sort immédiatement (une
 * redirection est déjà en cours : inutile de continuer l'initialisation).
 */
export function exitEditModeIfNeeded(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  const mode = url.searchParams.get("Mode");
  if (mode && mode.toLowerCase() === "edit") {
    url.searchParams.delete("Mode");
    window.location.replace(url.toString());
    return true;
  }
  return false;
}

function hideById(id: string): void {
  const node = document.getElementById(id);
  if (!node) return;
  node.style.setProperty("display", "none", "important");
  node.style.setProperty("height", "0", "important");
  node.style.setProperty("min-height", "0", "important");
  node.style.setProperty("overflow", "hidden", "important");
}

function hideNode(node: Element | null, domElement: HTMLElement): void {
  if (!node || node === domElement) return;
  if (domElement.contains(node) || node.contains(domElement)) return;
  (node as HTMLElement).style.setProperty("display", "none", "important");
}

/** Masque tout ce qui suit la section du web part dans le canvas de page. */
function hideCanvasBelow(domElement: HTMLElement): void {
  const canvas = document.getElementById("spPageCanvasContent");
  if (canvas) {
    canvas.style.setProperty("padding-bottom", "0", "important");
    canvas.style.setProperty("margin-bottom", "0", "important");
    canvas.style.setProperty("min-height", "0", "important");
  }

  const section = domElement.closest(
    '[data-automation-id="CanvasSection"], .CanvasSection'
  );
  if (section) {
    const sectionEl = section as HTMLElement;
    sectionEl.style.setProperty("padding-bottom", "0", "important");
    sectionEl.style.setProperty("margin-bottom", "0", "important");
    sectionEl.style.setProperty("min-height", "0", "important");

    let sibling = section.nextElementSibling;
    while (sibling) {
      const next = sibling.nextElementSibling;
      hideNode(sibling, domElement);
      sibling = next;
    }
  }

  document
    .querySelectorAll(
      [
        '[data-automation-id="CanvasZone-SectionToolbar"]',
        '[data-automation-id="insertZone"]',
        '[data-automation-id="pageFooter"]',
        "[data-sp-feature-region]",
        "#CommentsWrapper",
        ".sp-pageLayout-pageFooter",
        "#footer",
        ".sp-pageLayout-spacer",
        "#spLeftNav",
        ".sp-pageLayout-leftNav",
      ].join(",")
    )
    .forEach((node) => hideNode(node, domElement));
}

/**
 * Positionne le HOST en plein écran et neutralise ce qui l'entoure.
 *
 * `domElement` = le host monté sur <body> (contenu réel).
 * `placeholder` = l'emplacement d'origine dans le canvas, conservé
 * uniquement pour savoir quelle section masquer.
 */
function applyLayout(domElement: HTMLElement, placeholder: HTMLElement): void {
  const suiteBar = document.getElementById("suiteBarDelta");
  const suiteBarHeight =
    suiteBar && suiteBar.offsetHeight > 0 ? suiteBar.offsetHeight : 0;

  // Le host étant décalé de `suiteBarHeight` et haut de
  // `calc(100vh - suiteBarHeight)`, `100vh` mesuré DEPUIS L'INTÉRIEUR du web
  // part dépasse la zone réellement visible d'exactement cette hauteur. On
  // publie donc la valeur en variable CSS pour que les sections qui veulent
  // faire « un écran » puissent la retrancher. Fallback `0px` côté CSS : en
  // Workbench il n'y a pas de suite bar, la variable n'est jamais posée.
  document.documentElement.style.setProperty(
    "--ika-suitebar",
    `${suiteBarHeight}px`
  );

  domElement.style.setProperty("position", "fixed", "important");
  domElement.style.setProperty("top", `${suiteBarHeight}px`, "important");
  domElement.style.setProperty("left", "0", "important");
  domElement.style.setProperty("width", "100vw", "important");
  domElement.style.setProperty(
    "height",
    `calc(100vh - ${suiteBarHeight}px)`,
    "important"
  );
  domElement.style.setProperty("max-width", "100vw", "important");
  domElement.style.setProperty(
    "max-height",
    `calc(100vh - ${suiteBarHeight}px)`,
    "important"
  );
  domElement.style.setProperty("margin", "0", "important");
  domElement.style.setProperty("padding", "0", "important");
  domElement.style.setProperty("z-index", "1", "important");
  domElement.style.setProperty("overflow-y", "auto", "important");
  domElement.style.setProperty("overflow-x", "hidden", "important");
  domElement.style.setProperty("background", "#fff", "important");

  if (suiteBar) {
    suiteBar.style.setProperty("position", "fixed", "important");
    suiteBar.style.setProperty("top", "0", "important");
    suiteBar.style.setProperty("left", "0", "important");
    suiteBar.style.setProperty("width", "100vw", "important");
    suiteBar.style.setProperty("z-index", "99999", "important");
  }

  document.documentElement.style.setProperty("margin", "0", "important");
  document.documentElement.style.setProperty("padding", "0", "important");
  document.documentElement.style.setProperty("overflow-x", "hidden", "important");
  document.documentElement.style.setProperty("background", "#fff", "important");

  document.body.style.setProperty("margin", "0", "important");
  document.body.style.setProperty("padding", "0", "important");
  document.body.style.setProperty("overflow-x", "hidden", "important");
  document.body.style.setProperty("background", "#fff", "important");

  ["sideNavBox", "footer", "globalNavBox", "DeltaTopNavigation", "DeltaSuiteNavigation", "workbench-page"].forEach(
    hideById
  );

  const contentBox = document.getElementById("contentBox");
  if (contentBox) {
    contentBox.style.setProperty("margin-left", "0", "important");
    contentBox.style.setProperty("padding", "0", "important");
    contentBox.style.setProperty("max-width", "none", "important");
    contentBox.style.setProperty("width", "100%", "important");
  }

  const deltaSPContent = document.getElementById("DeltaSPPageContentArea");
  if (deltaSPContent) {
    deltaSPContent.style.setProperty("padding", "0", "important");
  }

  // Le host étant enfant direct de <body>, cette boucle ne s'exécute plus
  // (aucun ancêtre intermédiaire à neutraliser) : c'est précisément l'intérêt
  // du montage sur <body>. Elle est conservée par sécurité au cas où le host
  // serait ré-parenté par le canvas React entre deux passes.
  let parent = domElement.parentElement;
  while (parent && parent !== document.body) {
    parent.style.setProperty("max-width", "none", "important");
    parent.style.setProperty("width", "100%", "important");
    parent.style.setProperty("padding", "0", "important");
    parent.style.setProperty("margin", "0", "important");
    parent.style.setProperty("overflow", "visible", "important");
    // Neutralise aussi les propriétés qui feraient de cet ancêtre le BLOC
    // CONTENEUR d'un `position: fixed` (cause racine du rognage en Workbench).
    parent.style.setProperty("transform", "none", "important");
    parent.style.setProperty("filter", "none", "important");
    parent.style.setProperty("perspective", "none", "important");
    parent.style.setProperty("contain", "none", "important");
    parent.style.setProperty("will-change", "auto", "important");
    parent = parent.parentElement;
  }

  hideCanvasBelow(placeholder);
}

/**
 * `domElement` est l'emplacement d'ORIGINE du web part dans le canvas : il
 * n'accueille plus le contenu (voir `ensureFullPageHost`), il sert de repère
 * pour masquer la section hôte et il est réduit à zéro.
 */
export function installFullPageChrome(domElement: HTMLElement | undefined | null): void {
  if (typeof document === "undefined" || !domElement) return;

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.type = "text/css";
    style.textContent = STATIC_CSS;
    document.head.appendChild(style);
  }

  const host = ensureFullPageHost();
  collapsePlaceholder(domElement);
  applyLayout(host, domElement);

  if (!observer) {
    observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        applyLayout(ensureFullPageHost(), domElement);
      }, 150);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  // Vérification runtime : une seule recharge suffit alors à savoir si la
  // prise en main a réussi, sans avoir à inspecter le DOM à la main.
  const rect = host.getBoundingClientRect();
  const ok = Math.round(rect.left) === 0 && Math.round(rect.width) === window.innerWidth;
  console.log(
    `[ika-fullpage] host left=${Math.round(rect.left)} width=${Math.round(
      rect.width
    )} viewport=${window.innerWidth} -> ${ok ? "PLEINE LARGEUR OK" : "TOUJOURS CONTRAINT"}`
  );
}

export function removeFullPageChrome(): void {
  if (typeof document === "undefined") return;
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  const style = document.getElementById(STYLE_ID);
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }
  // Posée sur <html> par `applyLayout` : hors du DOM du web part, donc à
  // nettoyer explicitement comme le host.
  document.documentElement.style.removeProperty("--ika-suitebar");
  // Le host est monté sur <body>, hors du DOM géré par SPFx : il ne serait
  // donc PAS nettoyé automatiquement à la destruction du web part.
  const host = document.getElementById(HOST_ID);
  if (host && host.parentNode) {
    host.parentNode.removeChild(host);
  }
}
