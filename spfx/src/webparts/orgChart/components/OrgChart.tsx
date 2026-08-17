import * as React from "react";

import { IOrgChartProps } from "./IOrgChartProps";
import { OrgProfilePanel } from "./OrgProfilePanel";
import {
  Division,
  ICollaborateur,
  IOrgNode,
} from "../../../models/IIkaModels";
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

const NAME_OVERRIDES: Record<string, string> = {
  "Sandrine Tiahoun KINI": "Sandrine T. KINI",
  "Tegawende Martin YAMEOGO": "Tegawende M. YAMEOGO",
};

const ROLE_OVERRIDES: Record<string, string> = {
  "SERGE GEDEON OUE": "Ingénieur Principal",
  "Aminata HEMA": "Comptable",
  "Roukiatou OUEDRAOGO": "Responsable Commerciale",
};

const DIVISION_OVERRIDES: Record<string, Division> = {
  Engineering: "Direction Technique",
  Comptabilité: "Direction Comptabilité",
  "Ventes & Marketing": "Direction Commerciale",
};

const DIRECTION_ORDER = [
  "Direction Générale",
  "Direction Technique",
  "Direction Comptabilité",
  "Direction Commerciale",
];

const DIRECTION_ICONS: Record<string, string> = {
  "Direction Générale": "Building2",
  "Direction Technique": "Code2",
  "Direction Comptabilité": "ShieldCheck",
  "Direction Commerciale": "Megaphone",
};

function displayCollaborator(person: ICollaborateur): ICollaborateur {
  return {
    ...person,
    Title: NAME_OVERRIDES[person.Title] || person.Title,
    JobTitle: ROLE_OVERRIDES[person.Title] || person.JobTitle,
    Division: DIVISION_OVERRIDES[person.Division] || person.Division,
  };
}

function displayNode(node: IOrgNode): IOrgNode {
  return {
    ...displayCollaborator(node),
    children: node.children.map(displayNode),
  };
}

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

export const OrgChart: React.FC<IOrgChartProps> = (props) => {
  const {
    title,
    subtitle,
    roots: sourceRoots,
    flat: sourceFlat,
    loading,
    error,
    showSearch,
    showControls,
    initialZoom,
    defaultCollapsedDepth,
  } = props;

  const roots = React.useMemo(() => sourceRoots.map(displayNode), [sourceRoots]);
  const flat = React.useMemo(
    () => sourceFlat.map(displayCollaborator),
    [sourceFlat]
  );

  const [zoom, setZoom] = React.useState<number>(initialZoom);
  const [search, setSearch] = React.useState<string>("");
  const [selected, setSelected] = React.useState<ICollaborateur | undefined>(
    undefined
  );
  const [collapsed, setCollapsed] = React.useState<number[]>([]);
  const [initialised, setInitialised] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (initialised || roots.length === 0) return;
    setCollapsed(collectIds(roots, 0, defaultCollapsedDepth));
    setInitialised(true);
  }, [roots, defaultCollapsedDepth, initialised]);

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
    const groupId = flat.filter(
      (person) =>
        person.Division === member.Division && person.HierarchyLevel !== 1
    )[0]?.Id;
    if (trail || groupId !== undefined) {
      setCollapsed((current) =>
        current.filter(
          (id) =>
            (trail ? trail.indexOf(id) === -1 : true) && id !== groupId
        )
      );
    }
    setSelected(member);
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

    const director = flat.filter(
      (person) => !person.Manager || person.HierarchyLevel === 1
    )[0];
    const directionGroups = DIRECTION_ORDER.map((division) => ({
      division,
      members: flat.filter(
        (person) => person.Id !== director?.Id && person.Division === division
      ),
    }));

    return (
      <div className="ika-overflow-auto ika-px-6 ika-py-12">
        <div
          className="ika-mx-auto ika-flex ika-min-w-max ika-origin-top ika-flex-col ika-items-center ika-transition-transform ika-duration-300"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {director ? (
            <button
              type="button"
              onClick={() => setSelected(director)}
              className="ika-group ika-relative ika-cursor-pointer ika-border-0 ika-bg-transparent ika-p-0"
            >
              <span className="ika-absolute ika--inset-1 ika-rounded-3xl ika-bg-gradient-to-r ika-from-violet-500 ika-via-purple-500 ika-to-indigo-500 ika-opacity-20 ika-blur-lg ika-transition-all ika-duration-500 group-hover:ika-opacity-40 group-hover:ika-blur-xl" />
              <span className="ika-relative ika-block ika-overflow-hidden ika-rounded-3xl ika-border ika-border-violet-200/50 ika-bg-white ika-shadow-xl ika-transition-all ika-duration-300 group-hover:-ika-translate-y-1 group-hover:ika-shadow-2xl">
                <span className="ika-relative ika-block ika-bg-gradient-to-br ika-from-violet-600 ika-via-purple-600 ika-to-indigo-700 ika-px-8 ika-pb-14 ika-pt-6">
                  <span className="ika-text-xs ika-font-bold ika-uppercase ika-tracking-[0.2em] ika-text-white/80">
                    Directeur Général
                  </span>
                </span>
                <span className="ika-relative ika--mt-10 ika-flex ika-justify-center">
                  <span className="ika-rounded-full ika-bg-white ika-p-1 ika-shadow-lg">
                    <img
                      src={
                        director.Photo
                          ? buildImageUrl(director.Photo, 240)
                          : buildUserPhotoUrl(director.Email, "M")
                      }
                      alt={director.Title}
                      className="ika-h-20 ika-w-20 ika-rounded-full ika-object-cover ika-object-top ika-ring-[3px] ika-ring-violet-200"
                    />
                  </span>
                </span>
                <span className="ika-block ika-px-8 ika-pb-6 ika-pt-3 ika-text-center">
                  <span className="ika-block ika-text-lg ika-font-extrabold ika-tracking-tight ika-text-slate-900">
                    {director.Title}
                  </span>
                  <span className="ika-mt-1 ika-block ika-text-sm ika-font-medium ika-text-slate-500">
                    {director.JobTitle}
                  </span>
                </span>
              </span>
            </button>
          ) : null}

          <div className="ika-h-10 ika-w-px ika-bg-gradient-to-b ika-from-violet-300 ika-to-slate-300" />
          <div className="ika-h-3 ika-w-3 ika-rounded-full ika-border-2 ika-border-slate-300 ika-bg-white ika-shadow-sm" />

          <div className="ika-relative ika-flex ika-items-start">
            <div className="ika-absolute ika-left-32 ika-right-32 ika-top-0 ika-h-px ika-bg-slate-300" />
            <div className="ika-flex ika-gap-6">
              {directionGroups.map((group) => {
                const style = divisionStyle(group.division);
                const collapseId = group.members[0]?.Id || DIRECTION_ORDER.indexOf(group.division) * -1 - 1;
                const isCollapsed = collapsed.indexOf(collapseId) !== -1;
                return (
                  <div key={group.division} className="ika-flex ika-flex-col ika-items-center">
                    <div className="ika-h-8 ika-w-px ika-bg-slate-300" />
                    <div className={cn("ika-mb-2 ika-h-2.5 ika-w-2.5 ika-rounded-full ika-bg-gradient-to-br ika-shadow-sm", style.gradient)} />
                    <div className="ika-group ika-relative ika-w-64">
                      <div className={cn("ika-absolute ika--inset-0.5 ika-rounded-2xl ika-bg-gradient-to-r ika-opacity-0 ika-blur ika-transition-all ika-duration-300 group-hover:ika-opacity-15", style.gradient)} />
                      <div className={cn("ika-relative ika-overflow-hidden ika-rounded-2xl ika-border ika-bg-white ika-shadow-sm ika-transition-all ika-duration-300 group-hover:ika-shadow-lg", style.border)}>
                        <div className={cn("ika-relative ika-bg-gradient-to-r ika-px-4 ika-py-3", style.gradient)}>
                          <div className="ika-flex ika-items-center ika-justify-between">
                            <div className="ika-flex ika-items-center ika-gap-2">
                              <div className="ika-flex ika-h-7 ika-w-7 ika-items-center ika-justify-center ika-rounded-lg ika-bg-white/20 ika-backdrop-blur-sm">
                                <Icon name={DIRECTION_ICONS[group.division]} className="ika-h-3.5 ika-w-3.5 ika-text-white" />
                              </div>
                              <div>
                                <h3 className="ika-text-xs ika-font-bold ika-text-white">{group.division}</h3>
                                <p className="ika-text-[10px] ika-text-white/70">
                                  {group.members.length} {group.members.length > 1 ? "membres" : "membre"}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggle(collapseId)}
                              aria-expanded={!isCollapsed}
                              className="ika-flex ika-h-6 ika-w-6 ika-items-center ika-justify-center ika-rounded-full ika-bg-white/20 ika-text-white ika-backdrop-blur-sm ika-transition-colors hover:ika-bg-white/30"
                            >
                              <Icon name={isCollapsed ? "ChevronRight" : "ChevronDown"} className="ika-h-3 ika-w-3" />
                            </button>
                          </div>
                        </div>
                        {!isCollapsed ? (
                          <div className="ika-space-y-2 ika-p-3">
                            {group.members.map((member) => (
                              <button
                                type="button"
                                key={member.Id}
                                onClick={() => setSelected(member)}
                                className={cn("ika-flex ika-w-full ika-cursor-pointer ika-items-center ika-gap-3 ika-rounded-xl ika-border ika-bg-white ika-p-3 ika-text-left ika-shadow-sm ika-transition-all ika-duration-200 hover:-ika-translate-y-0.5 hover:ika-shadow-md", style.border)}
                              >
                                <img
                                  src={member.Photo ? buildImageUrl(member.Photo, 96) : buildUserPhotoUrl(member.Email, "S")}
                                  alt={member.Title}
                                  className={cn("ika-h-10 ika-w-10 ika-shrink-0 ika-rounded-full ika-object-cover ika-object-top ika-ring-2", style.ring)}
                                />
                                <span className="ika-min-w-0">
                                  <span className="ika-block ika-truncate ika-text-xs ika-font-bold ika-text-slate-900">{member.Title}</span>
                                  <span className={cn("ika-block ika-truncate ika-text-[10px] ika-font-semibold", style.text)}>{member.JobTitle}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
      <div className="ika-relative ika-min-h-screen ika-bg-gradient-to-br ika-from-slate-50 ika-via-white ika-to-slate-100">
        <div className="ika-sticky ika-top-0 ika-z-30 ika-border-b ika-border-slate-200/80 ika-bg-white/80 ika-backdrop-blur-xl">
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
              <div className="ika-relative ika-min-w-[200px] ika-max-w-xs ika-flex-1">
                <span className="ika-pointer-events-none ika-absolute ika-left-3 ika-top-1/2 ika--translate-y-1/2 ika-text-slate-400">
                  <Icon name="Search" className="ika-h-3.5 ika-w-3.5" />
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
                  <ul className="ika-absolute ika-left-0 ika-right-0 ika-top-full ika-z-50 ika-mt-2 ika-overflow-hidden ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-shadow-xl">
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
                            className="ika-flex ika-w-full ika-items-center ika-gap-3 ika-px-4 ika-py-3 ika-text-left ika-transition-colors hover:ika-bg-slate-50"
                          >
                            <img
                              src={
                                person.Photo
                                  ? buildImageUrl(person.Photo, 64)
                                  : buildUserPhotoUrl(person.Email, "S")
                              }
                              alt=""
                              className="ika-h-9 ika-w-9 ika-rounded-full ika-ring-2 ika-ring-slate-100 ika-object-cover ika-object-top"
                            />
                            <span className="ika-min-w-0 ika-flex-1">
                              <span className="ika-block ika-truncate ika-text-sm ika-font-bold ika-text-slate-900">
                                {person.Title}
                              </span>
                              <span
                                className={cn(
                                  "ika-block ika-truncate ika-text-[10px] ika-font-semibold",
                                  style.text
                                )}
                              >
                                {person.JobTitle}
                              </span>
                            </span>

                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="ika-hidden ika-items-center ika-gap-3 xl:ika-flex">
              {DIRECTION_ORDER.map((division) => {
                const style = divisionStyle(division);
                return (
                  <div
                    key={division}
                    className={cn(
                      "ika-flex ika-items-center ika-gap-1.5 ika-rounded-lg ika-px-2.5 ika-py-1.5",
                      style.bg
                    )}
                  >
                    <Icon
                      name={DIRECTION_ICONS[division]}
                      className={cn("ika-h-[11px] ika-w-[11px]", style.text)}
                    />
                    <span className={cn("ika-text-[10px] ika-font-bold", style.text)}>
                      {division.replace("Direction ", "")}
                    </span>
                  </div>
                );
              })}
            </div>

            {showControls ? (
              <div className="ika-ml-auto ika-flex ika-items-center ika-gap-2">
                <div className="ika-flex ika-items-center ika-gap-1.5 ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-px-2.5 ika-py-1.5 ika-shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
                    }
                    disabled={zoom <= ZOOM_MIN}
                    aria-label="Dézoomer"
                    className="ika-flex ika-h-6 ika-w-6 ika-items-center ika-justify-center ika-rounded-lg ika-text-slate-400 ika-transition-colors hover:ika-bg-slate-100 hover:ika-text-slate-700 disabled:ika-opacity-40"
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
                  <span className="ika-w-10 ika-text-center ika-text-xs ika-font-bold ika-tabular-nums ika-text-slate-600">
                    {zoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
                    }
                    disabled={zoom >= ZOOM_MAX}
                    aria-label="Zoomer"
                    className="ika-flex ika-h-6 ika-w-6 ika-items-center ika-justify-center ika-rounded-lg ika-text-slate-400 ika-transition-colors hover:ika-bg-slate-100 hover:ika-text-slate-700 disabled:ika-opacity-40"
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
              </div>
            ) : null}

            {!loading && !error ? (
              <div className="ika-flex ika-items-center ika-gap-2 ika-rounded-xl ika-bg-slate-100 ika-px-3 ika-py-2">
                <Icon name="Users" className="ika-h-3.5 ika-w-3.5 ika-text-slate-500" />
                <span className="ika-text-xs ika-font-bold ika-text-slate-600">
                  {flat.length} collaborateurs
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
