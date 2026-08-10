import * as React from "react";

import { IOrgChartProps } from "./IOrgChartProps";
import { OrgNodeCard } from "./OrgNodeCard";
import { OrgProfilePanel } from "./OrgProfilePanel";
import { ICollaborateur, IOrgNode } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { divisionStyle } from "../../../common/utils/divisionStyle";
import {
  buildImageUrl,
  buildUserPhotoUrl,
  cn,
} from "../../../common/utils/spUtils";

const ZOOM_MIN = 40;
const ZOOM_MAX = 150;
const ZOOM_STEP = 10;

function collectIds(nodes: IOrgNode[], depth: number, minDepth: number): number[] {
  let ids: number[] = [];
  nodes.forEach((node) => {
    if (depth >= minDepth && node.children.length > 0) ids.push(node.Id);
    ids = ids.concat(collectIds(node.children, depth + 1, minDepth));
  });
  return ids;
}

function pathToRoot(
  nodes: IOrgNode[],
  targetId: number,
  trail: number[]
): number[] | undefined {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.Id === targetId) return trail;
    const found = pathToRoot(node.children, targetId, trail.concat([node.Id]));
    if (found) return found;
  }
  return undefined;
}

const Connector: React.FC<{ childCount: number }> = (props) => {
  if (props.childCount === 0) return null;

  return (
    <div className="ika-flex ika-flex-col ika-items-center" aria-hidden="true">
      <div className="ika-h-8 ika-w-px ika-bg-slate-300" />
    </div>
  );
};

const SubtreeRow: React.FC<{
  nodes: IOrgNode[];
  renderNode: (node: IOrgNode) => React.ReactElement;
}> = (props) => {
  const { nodes, renderNode } = props;
  const multiple = nodes.length > 1;

  return (
    <div className="ika-flex ika-items-start ika-justify-center">
      {nodes.map((child, index) => {
        const isFirst = index === 0;
        const isLast = index === nodes.length - 1;

        return (
          <div
            key={child.Id}
            className="ika-relative ika-flex ika-flex-col ika-items-center ika-px-3"
          >
            {multiple ? (
              <>
                <div
                  aria-hidden="true"
                  className={cn(
                    "ika-absolute ika-top-0 ika-h-px ika-bg-slate-300",
                    isFirst ? "ika-left-1/2 ika-right-0" : "",
                    isLast ? "ika-left-0 ika-right-1/2" : "",
                    !isFirst && !isLast ? "ika-left-0 ika-right-0" : ""
                  )}
                />
                <div
                  aria-hidden="true"
                  className="ika-h-8 ika-w-px ika-bg-slate-300"
                />
              </>
            ) : (
              <div
                aria-hidden="true"
                className="ika-h-8 ika-w-px ika-bg-slate-300"
              />
            )}

            {renderNode(child)}
          </div>
        );
      })}
    </div>
  );
};

export const OrgChart: React.FC<IOrgChartProps> = (props) => {
  const {
    title,
    subtitle,
    roots,
    flat,
    loading,
    error,
    showSearch,
    showControls,
    initialZoom,
    defaultCollapsedDepth,
  } = props;

  const [zoom, setZoom] = React.useState<number>(initialZoom);
  const [search, setSearch] = React.useState<string>("");
  const [selected, setSelected] = React.useState<ICollaborateur | undefined>(
    undefined
  );
  const [collapsed, setCollapsed] = React.useState<number[]>([]);
  const [initialised, setInitialised] = React.useState<boolean>(false);
  const [fullscreen, setFullscreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (initialised || roots.length === 0) return;
    setCollapsed(collectIds(roots, 0, defaultCollapsedDepth));
    setInitialised(true);
  }, [roots, defaultCollapsedDepth, initialised]);

  React.useEffect(() => {
    if (!fullscreen) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const needle = search.toLowerCase().trim();

  const matchedIds = React.useMemo<number[]>(() => {
    if (needle.length < 2) return [];
    return flat
      .filter(
        (person) =>
          person.Title.toLowerCase().indexOf(needle) !== -1 ||
          (person.JobTitle || "").toLowerCase().indexOf(needle) !== -1
      )
      .map((person) => person.Id);
  }, [needle, flat]);

  const toggle = (id: number): void => {
    setCollapsed((current) =>
      current.indexOf(id) !== -1
        ? current.filter((value) => value !== id)
        : current.concat([id])
    );
  };

  const revealAndSelect = (member: ICollaborateur): void => {
    const trail = pathToRoot(roots, member.Id, []);
    if (trail) {
      setCollapsed((current) =>
        current.filter((id) => trail.indexOf(id) === -1)
      );
    }
    setSelected(member);
  };

  const renderNode = (node: IOrgNode): React.ReactElement => {
    const isCollapsed = collapsed.indexOf(node.Id) !== -1;
    const isMatch = matchedIds.indexOf(node.Id) !== -1;

    return (
      <div key={node.Id} className="ika-flex ika-flex-col ika-items-center">
        <OrgNodeCard
          node={node}
          isRoot={false}
          matched={isMatch}
          dimmed={needle.length >= 2 && !isMatch}
          collapsed={isCollapsed}
          onSelect={(target) => setSelected(target)}
          onToggle={toggle}
        />

        {node.children.length > 0 && !isCollapsed ? (
          <>
            <Connector childCount={node.children.length} />
            <SubtreeRow nodes={node.children} renderNode={renderNode} />
          </>
        ) : null}
      </div>
    );
  };

  const managerOf = (member: ICollaborateur): ICollaborateur | undefined => {
    if (!member.Manager) return undefined;
    return flat.filter((person) => person.Id === member.Manager!.Id)[0];
  };

  const reportsOf = (member: ICollaborateur): ICollaborateur[] =>
    flat.filter(
      (person) => !!person.Manager && person.Manager.Id === member.Id
    );

  const renderChart = (): React.ReactElement => {
    if (loading) {
      return (
        <div
          className="ika-flex ika-flex-col ika-items-center ika-gap-8 ika-py-12 ika-animate-pulse"
          aria-hidden="true"
        >
          <div className="ika-h-48 ika-w-64 ika-rounded-2xl ika-bg-slate-200" />
          <div className="ika-flex ika-gap-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="ika-h-40 ika-w-52 ika-rounded-2xl ika-bg-slate-100"
              />
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          role="alert"
          className="ika-mx-auto ika-max-w-md ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6 ika-text-center"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (roots.length === 0) {
      return (
        <div className="ika-mx-auto ika-max-w-md ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
            Organigramme vide
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
            Renseignez la colonne « Responsable » des collaborateurs pour
            construire la hiérarchie.
          </p>
        </div>
      );
    }

    return (
      <div className="ika-overflow-auto ika-px-6 ika-py-12">
        <div
          className="ika-mx-auto ika-flex ika-min-w-max ika-flex-col ika-items-center ika-origin-top ika-transition-transform ika-duration-300"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {roots.map((root) => {
            const isCollapsed = collapsed.indexOf(root.Id) !== -1;
            const isMatch = matchedIds.indexOf(root.Id) !== -1;

            return (
              <div
                key={root.Id}
                className="ika-flex ika-flex-col ika-items-center"
              >
                <OrgNodeCard
                  node={root}
                  isRoot={true}
                  matched={isMatch}
                  dimmed={needle.length >= 2 && !isMatch}
                  collapsed={isCollapsed}
                  onSelect={(target) => setSelected(target)}
                  onToggle={toggle}
                />

                {root.children.length > 0 && !isCollapsed ? (
                  <>
                    <Connector childCount={root.children.length} />
                    <SubtreeRow
                      nodes={root.children}
                      renderNode={renderNode}
                    />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const searchResults =
    needle.length >= 2
      ? flat.filter((person) => matchedIds.indexOf(person.Id) !== -1).slice(0, 6)
      : [];

  return (
    <div className="ika-root">
      <div
        className={cn(
          "ika-bg-gradient-to-br ika-from-slate-50 ika-via-white ika-to-slate-100",
          fullscreen
            ? "ika-fixed ika-inset-0 ika-z-[900] ika-overflow-auto"
            : "ika-relative ika-rounded-2xl ika-border ika-border-slate-200"
        )}
      >
        <div className="ika-sticky ika-top-0 ika-z-30 ika-border-b ika-border-slate-200 ika-bg-white/85 ika-backdrop-blur-xl">
          <div className="ika-mx-auto ika-flex ika-max-w-7xl ika-flex-wrap ika-items-center ika-gap-4 ika-px-6 ika-py-4">
            <div className="ika-flex ika-items-center ika-gap-3">
              <span className="ika-grid ika-h-9 ika-w-9 ika-place-items-center ika-rounded-xl ika-bg-gradient-to-br ika-from-violet-500 ika-to-purple-600 ika-text-white ika-shadow-lg ika-shadow-violet-200">
                <Icon name="Building2" className="ika-h-4 ika-w-4" />
              </span>
              <div>
                <h2 className="ika-text-lg ika-font-extrabold ika-tracking-tight ika-text-slate-900">
                  {title}
                </h2>
                <p className="ika-text-[10px] ika-font-medium ika-text-slate-400">
                  {subtitle}
                </p>
              </div>
            </div>

            {showSearch ? (
              <div className="ika-relative ika-min-w-[200px] ika-flex-1">
                <span className="ika-pointer-events-none ika-absolute ika-left-3 ika-top-1/2 ika--translate-y-1/2 ika-text-slate-400">
                  <Icon name="target" className="ika-h-4 ika-w-4" />
                </span>
                <label htmlFor="ika-org-search" className="ika-sr-only">
                  Rechercher un collaborateur
                </label>
                <input
                  id="ika-org-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un collaborateur…"
                  className="ika-w-full ika-rounded-xl ika-border ika-border-slate-200 ika-bg-slate-50/50 ika-py-2.5 ika-pl-9 ika-pr-4 ika-text-sm ika-text-slate-700 ika-placeholder-slate-400 ika-outline-none ika-transition-all focus:ika-border-violet-300 focus:ika-bg-white focus:ika-ring-4 focus:ika-ring-violet-50"
                />

                {searchResults.length > 0 ? (
                  <ul className="ika-absolute ika-left-0 ika-right-0 ika-top-full ika-z-40 ika-mt-1 ika-overflow-hidden ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-shadow-lg">
                    {searchResults.map((person) => {
                      const style = divisionStyle(person.Division);
                      return (
                        <li key={person.Id}>
                          <button
                            type="button"
                            onClick={() => {
                              revealAndSelect(person);
                              setSearch("");
                            }}
                            className="ika-flex ika-w-full ika-items-center ika-gap-3 ika-px-3 ika-py-2 ika-text-left ika-transition-colors hover:ika-bg-slate-50"
                          >
                            <img
                              src={
                                person.Photo
                                  ? buildImageUrl(person.Photo, 64)
                                  : buildUserPhotoUrl(person.Email, "S")
                              }
                              alt=""
                              className="ika-h-7 ika-w-7 ika-rounded-full ika-object-cover ika-object-top"
                            />
                            <span className="ika-min-w-0 ika-flex-1">
                              <span className="ika-block ika-truncate ika-text-xs ika-font-semibold ika-text-brand-ink">
                                {person.Title}
                              </span>
                              <span className="ika-block ika-truncate ika-text-[11px] ika-text-slate-400">
                                {person.JobTitle}
                              </span>
                            </span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                "ika-h-2 ika-w-2 ika-shrink-0 ika-rounded-full",
                                style.dot
                              )}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {showControls ? (
              <div className="ika-flex ika-items-center ika-gap-2">
                <div className="ika-flex ika-items-center ika-gap-1 ika-rounded-xl ika-bg-slate-100 ika-p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
                    }
                    disabled={zoom <= ZOOM_MIN}
                    aria-label="Dézoomer"
                    className="ika-rounded-lg ika-p-1.5 ika-text-slate-600 ika-transition-colors hover:ika-bg-white disabled:ika-opacity-40"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                      className="ika-h-4 ika-w-4"
                    >
                      <path d="M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="ika-min-w-[42px] ika-text-center ika-text-xs ika-font-bold ika-tabular-nums ika-text-slate-600">
                    {zoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
                    }
                    disabled={zoom >= ZOOM_MAX}
                    aria-label="Zoomer"
                    className="ika-rounded-lg ika-p-1.5 ika-text-slate-600 ika-transition-colors hover:ika-bg-white disabled:ika-opacity-40"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                      className="ika-h-4 ika-w-4"
                    >
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCollapsed([])}
                  className="ika-rounded-xl ika-bg-slate-100 ika-px-3 ika-py-2 ika-text-xs ika-font-bold ika-text-slate-600 ika-transition-colors hover:ika-bg-slate-200"
                >
                  Tout déplier
                </button>

                <button
                  type="button"
                  onClick={() => setCollapsed(collectIds(roots, 0, 1))}
                  className="ika-rounded-xl ika-bg-slate-100 ika-px-3 ika-py-2 ika-text-xs ika-font-bold ika-text-slate-600 ika-transition-colors hover:ika-bg-slate-200"
                >
                  Tout replier
                </button>

                <button
                  type="button"
                  onClick={() => setFullscreen(!fullscreen)}
                  aria-label={
                    fullscreen ? "Quitter le plein écran" : "Plein écran"
                  }
                  className="ika-rounded-xl ika-bg-slate-100 ika-p-2 ika-text-slate-600 ika-transition-colors hover:ika-bg-slate-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                    className="ika-h-4 ika-w-4"
                  >
                    {fullscreen ? (
                      <path
                        d="M9 3v6H3M15 21v-6h6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M3 9V3h6M21 15v6h-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                </button>
              </div>
            ) : null}

            {!loading && !error ? (
              <div className="ika-flex ika-items-center ika-gap-2 ika-rounded-xl ika-bg-slate-100 ika-px-3 ika-py-2">
                <Icon name="Users" className="ika-h-3.5 ika-w-3.5 ika-text-slate-500" />
                <span className="ika-text-xs ika-font-bold ika-text-slate-600">
                  {flat.length}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {renderChart()}
      </div>

      {selected ? (
        <OrgProfilePanel
          member={selected}
          manager={managerOf(selected)}
          reports={reportsOf(selected)}
          onClose={() => setSelected(undefined)}
          onSelect={revealAndSelect}
        />
      ) : null}
    </div>
  );
};
