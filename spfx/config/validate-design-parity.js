#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "../..");
let failures = 0;

function read(relativePath) {
  return fs.readFileSync(path.join(REPO, relativePath), "utf8");
}

function expect(relativePath, values) {
  const source = read(relativePath);
  values.forEach((value) => {
    if (!source.includes(value)) {
      console.error(`ERREUR ${relativePath}: valeur absente: ${value}`);
      failures += 1;
    }
  });
}

function reject(relativePath, values) {
  const source = read(relativePath);
  values.forEach((value) => {
    if (source.includes(value)) {
      console.error(`ERREUR ${relativePath}: divergence détectée: ${value}`);
      failures += 1;
    }
  });
}

expect("spfx/config/tailwind.config.js", [
  'navy: "#0A2540"',
  'cyan: "#06B6D4"',
  'accent: "#E63946"',
  'marquee: "marquee 18s linear infinite"',
]);

expect("spfx/src/styles/tailwind.css", [
  "font-family: Arial, Helvetica, sans-serif",
  ".ika-root *::before",
]);

expect("spfx/src/webparts/heroSlider/components/HeroSlider.tsx", [
  "const SLIDE_INTERVAL_MS = 5000",
  "const MISSION_INTERVAL_MS = 6000",
  "ika-duration-1000",
  "const paused = !autoPlay || reduced",
  "src={buildImageUrl(slide.FileRef)}",
]);

reject("spfx/src/webparts/heroSlider/components/HeroSlider.tsx", [
  "onMouseEnter",
  "onMouseLeave",
]);

expect("spfx/src/webparts/intranetSections/components/IntranetSections.tsx", [
  "ika-bg-brand-navy",
  "ika-h-72",
  "md:ika-w-72",
  "ika-text-2xl ika-font-extrabold ika-text-white",
  "ika-rounded-xl ika-bg-white/5 ika-px-6 ika-py-5",
]);

expect("spfx/src/webparts/intranetMain/components/IntranetMain.tsx", [
  "autoPlay={props.animationsEnabled}",
  "stats={props.historyStats}",
  'className="ika-flex ika-flex-col lg:ika-flex-row"',
  'className="ika-w-full ika-min-w-0"',
  'title="BORDEREAU DES PRIX POUR LES FOURNITURES"',
]);

expect("sharepoint-ready-data/Indicateurs.csv", [
  "Collaborateurs,138,Users,Page histoire,1,TRUE",
  "Certifications,12,Award,Page histoire,6,TRUE",
]);

expect("sharepoint-ready-data/Collaborateurs.csv", [
  "SERGE GEDEON OUE,Développeur Full Stack",
  "Roukiatou OUEDRAOGO,Commerciale",
]);

expect("sharepoint-ready-data/LiensRapides.csv", [
  "Scope,Title,LinkDescription,LinkUrl,IconName",
  "global,Calcul bordereau des prix",
  "global,Politique Déplacements",
]);

expect("spfx/src/webparts/quickAccessPanel/components/QuickAccessPanel.tsx", [
  '"Charte Développement": "Code2"',
  "{doc.Title || doc.FileLeafRef}",
  "event.DisplayMonth || dayMonth.month",
  "event.DisplayDate || formatEventDate(event.EventDate)",
]);

expect("sharepoint-ready-data/Evenements.csv", [
  "DisplayDate,DisplayMonth,DisplayDay",
  '"Mar, 10 Juin, 10:00",JUN,10',
  '"Jeu, 3 Juil, 11:00",JUL,3',
]);

expect("sharepoint-ready-data/Annonces.csv", [
  "Priority,SortOrder",
  "Mariage de Koffi et Aïcha",
  "Soirée d'été IKA",
]);

const activeCollaborators = read("sharepoint-ready-data/Collaborateurs.csv")
  .split(/\r?\n/)
  .slice(1)
  .filter((line) => /,TRUE,\d+$/.test(line));
if (activeCollaborators.length !== 8) {
  console.error(
    `ERREUR sharepoint-ready-data/Collaborateurs.csv: ${activeCollaborators.length} profils actifs au lieu de 8`
  );
  failures += 1;
}

reject("spfx/src/webparts/intranetMain/components/IntranetMain.tsx", [
  "RevealSection",
  "useReveal",
]);

expect("spfx/src/webparts/orgChart/components/OrgChart.tsx", [
  '"SERGE GEDEON OUE": "Ingénieur Principal"',
  '"Roukiatou OUEDRAOGO": "Responsable Commerciale"',
  "const DIRECTION_ORDER = [",
  "Directeur Général",
]);

expect("spfx/src/webparts/orgChart/components/OrgProfilePanel.tsx", [
  "Coordonnées",
  'label: "Direction"',
  "ika-backdrop-blur-sm",
]);

expect("spfx/src/webparts/timeline/components/Timeline.tsx", [
  'Title: "Excellence Technique"',
  'Title: "Impact africain"',
  "<Values values={HISTORY_VALUES} />",
]);

expect("spfx/src/webparts/intranetMain/fullPageChrome.ts", [
  '[data-automation-id="CanvasZone"]',
  '[data-automation-id="CanvasControl"]',
  '[data-automation-id="pageHeader"]',
]);

expect("provisioning/Deploy-IkaIntranet.ps1", [
  "ConvertTo-ModernImageValue",
  'InternalName "Scope" -Type Text -Required',
  'Employee   = $serge.Id',
  'Department = $engineering.Id',
  '$managerLinks = @{',
  '@{ Manager = $manager.Id }',
  '$photoFolder = "SiteAssets/team"',
  'Name = "12-Modifier.jpg"',
  'Upload-FileToLibrary -LibraryName "SiteAssets" -LocalPath $logoPath',
  '$eventGalleryMap = @{',
  '@{ EventImage = $eventImageValue }',
  'Photo = $cdmImageValue',
]);

[
  "public/assets/logo.png",
  "public/assets/team/12-Modifier.jpg",
  "public/assets/team/13-Modifier.jpg",
  "public/assets/team/14-Modifier.jpg",
  "public/assets/team/DG.jpg",
  "public/assets/team/Serge.jpg",
  "public/assets/team/Daouda.jpg",
  "public/assets/team/SANDRINE.jpg",
  "public/assets/team/Martin.jpg",
  "public/assets/team/Roukie.jpg",
  "public/assets/team/Victorine.jpg",
  "public/assets/team/aminata.jpg",
].forEach((relativePath) => {
  if (!fs.existsSync(path.join(REPO, relativePath))) {
    console.error(`ERREUR asset absent: ${relativePath}`);
    failures += 1;
  }
});

if (failures > 0) {
  console.error(`\nValidation de parité échouée: ${failures} anomalie(s).`);
  process.exit(1);
}

console.log("Validation de parité Next.js ↔ SharePoint réussie.");
