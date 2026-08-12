# 15 — Rendering, immersive layout, and current-user diagnostics

This guide applies to `IntranetMainWebPart` (SPFx 1.23.2 / React 17.0.1).

## 1. Root cause of the missing home sections

The sections were mounted in the React tree, but `RevealSection` kept them
visually hidden with `ika-opacity-0 ika-translate-y-4`.

The old implementation did this:

1. `IntersectionObserver` called `setVisible(true)`.
2. React rendered while `ref.current.dataset.visible` still contained `false`.
3. An effect then changed the DOM dataset to `true`.
4. Updating a DOM `data-*` attribute does not trigger another React render.
5. The hidden Tailwind classes therefore remained on the element.

The corrected implementation uses React state (`visible`) directly to choose
the classes. `data-visible` is now only a diagnostic reflection of that state.
It also reveals content when `IntersectionObserver` is unavailable or the user
prefers reduced motion.

## 2. Systematic browser diagnosis

### Phase A — confirm the SPFx lifecycle

Set breakpoints in these methods, without modifying the production bundle:

- `IntranetMainWebPart.onInit()` — should execute once per Web Part instance.
- `IntranetMainWebPart.render()` — first render has `loading=true`.
- `IntranetMainWebPart._load()` — all list requests start in parallel.
- `_load().finally()` — sets `loading=false` and calls `render()` again.
- `IntranetMainWebPart.onDispose()` — should run only when the Web Part leaves
  the page.

In React DevTools, verify that `IntranetMain` changes from the skeleton to the
real tree and that the display toggles (`showNews`, `showQuickAccess`, and so
on) are `true`.

### Phase B — distinguish absent DOM from invisible DOM

Under `.ika-root > ... > main`, search for a section heading such as
`Actualités de l'entreprise`.

- Heading absent: inspect the corresponding `show*` property, an early return,
  a thrown render error, or an unexpected SPA hash route.
- Heading present: inspect its ancestors and computed styles. In particular,
  check `display`, `visibility`, `opacity`, `height`, `overflow`, `position`,
  and `transform`.
- A reveal wrapper should eventually have `data-visible="true"`,
  `ika-opacity-100`, and `ika-translate-y-0`.

Useful DevTools expressions after selecting the wrapper as `$0`:

```js
$0.getBoundingClientRect()
getComputedStyle($0).opacity
getComputedStyle($0).display
getComputedStyle($0).visibility
$0.closest('[data-visible]')?.dataset.visible
```

Temporarily disabling the `ika-opacity-0` rule in the Styles panel is a quick
way to prove that the content exists and that the defect is CSS/animation,
not data binding.

### Phase C — isolate rendering from data

1. Turn **Animations** off in the Web Part property pane. If all sections
   appear, the failure is in reveal/observer logic.
2. Verify Network requests to `/_api/web/lists/getByTitle(...)` and inspect
   non-2xx responses.
3. Confirm the component receives arrays, even when a list is empty. The data
   service currently falls back to mock data for individual list failures.
4. Test each section independently by turning the other `show*` properties
   off.
5. Look for the first actual React exception. One child throwing during render
   can unmount the single assembled Web Part.

A `404` from `graph.microsoft.com/.../photo/$value` means that the referenced
Microsoft 365 user has no profile photo (or that photo is unavailable). It is
not the cause of the reveal failure. The person-card components should retain
an initials/placeholder fallback for this case.

## 3. Full-width and immersive SharePoint options

### Recommended production architecture

Use a **modern Communication site**, place this Web Part in a **Full-width
section**, and disable site navigation through **Change the look → Navigation →
Site navigation visibility** when the whole site is intended to be immersive.
The manifest already has:

```json
"supportedHosts": ["SharePointWebPart", "SharePointFullPage"],
"supportsFullBleed": true
```

This is the least fragile solution because it does not depend on generated
SharePoint CSS class names.

### Single Part App Page

Create a page from **New → Page → Apps** and select the IKA Web Part. This uses
the `SharePointFullPage` host and guarantees one Web Part owns the page body.
It is a good option for the SPA/hash-router architecture, although SharePoint
still controls the global Microsoft 365 chrome.

For direct validation, the component can also be opened with:

```text
/_layouts/15/appPageHost.aspx?componentId=a3c2e7f1-9b8d-4a5e-8c1f-0b2d6a4c8e91
```

### Existing Team site / page-specific fallback

`fullPageChrome.ts` hides the modern Microsoft 365 suite bar, the SharePoint
app bar, the site header, left navigation, command bar, page title and canvas
padding. It runs on **hosted workbench** and on published pages. It stays off
only when a modern page is in `Mode=Edit`, so authors keep the SharePoint
editing tools.

Toggle **Plein écran** in the Web Part property pane to turn this off.

If this behavior must apply to several selected pages, package the logic as an
SPFx Application Customizer and activate it with explicit page/path rules.
Do not hide the Microsoft 365 Suite Bar or SharePoint App Bar: those are global
service chrome, not owned by an SPFx Web Part.

## 4. Current logged-in user

For a display name, no REST, Graph, or PnP dependency is required. SPFx already
hydrates the authenticated user in `WebPartContext`:

```ts
const pageUser = this.context.pageContext.user;
const displayName = pageUser.displayName
  ? pageUser.displayName.trim()
  : "";

const element = React.createElement(IntranetMain, {
  currentUser: displayName || "Collaborateur IKA",
  currentUserEmail: pageUser.email || "",
  // other props
});
```

The hero renders the prop normally:

```tsx
<p>{props.currentUser}</p>
```

The implementation no longer uses a person's name or job title as a fallback.
If richer fields such as `jobTitle`, department, office, or the authenticated
user's photo are required, use `MSGraphClientV3` and query `/me`; keep the
page-context value as the immediate render value and update state after the
profile request completes.

Do not add the deprecated `sp-pnp-js` package for this requirement. If PnP is
later needed for broader SharePoint operations, use the current modular
`@pnp/sp` package and initialize it with the SPFx context.

## 5. Deployment verification

1. Run `npm ci`, `npm run validate`, and `npm run build` from `spfx/`.
2. Upload the newly generated `sharepoint/solution/ika-intranet.sppkg`.
3. Confirm the App Catalog reports the new solution version.
4. Republish the page and hard-refresh once to avoid a stale component bundle.
5. Test with animations both enabled and disabled.
6. Confirm all reveal wrappers change to `data-visible="true"` while scrolling.
7. Confirm the welcome panel matches the signed-in account's SharePoint display
   name.
8. Treat missing profile-photo 404 responses separately from rendering errors.
