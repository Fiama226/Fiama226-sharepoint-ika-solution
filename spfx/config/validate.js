#!/usr/bin/env node
"use strict";

/**
 * Valide les artefacts du dossier spfx/ avant deploiement :
 *   - JSON bien forme (site scripts, manifests, config)
 *   - XML des schemaXml bien forme
 *   - GUIDs uniques
 *   - verbes de site script supportes
 *   - coherence listes / documentation
 *
 * Usage: node spfx/config/validate.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const VALID_VERBS = new Set([
  "createSPList", "addSPField", "addSPFieldXml", "addSPView", "setTitle",
  "setDescription", "applyTheme", "removeNavLink", "addNavLink",
  "addContentType", "removeContentType", "deleteSPField",
  "addContentTypesFromHub", "setSPFieldCustomFormatter", "associateFieldCustomizer",
  "addSPLookupFieldXml", "setSiteExternalSharingCapability", "triggerFlow",
  "joinHubSite", "installSolution", "associateExtension", "setRegionalSettings",
  "addPrincipalToSPGroup", "setSiteLogo", "createSiteColumn", "createContentType",
]);

const GUID_RE =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  ERREUR   ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ATTENTION ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`  OK       ${msg}`);
}

function walk(dir, ext, acc) {
  acc = acc || [];
  if (!fs.existsSync(dir)) return acc;
  fs.readdirSync(dir).forEach((entry) => {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (entry !== "node_modules") walk(full, ext, acc);
    } else if (full.endsWith(ext)) {
      acc.push(full);
    }
  });
  return acc;
}

function isWellFormedXml(xml) {
  const stack = [];
  const tagRe = /<\/?([A-Za-z_][\w.-]*)((?:\s+[\w:.-]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
  let match;
  let consumed = 0;

  while ((match = tagRe.exec(xml)) !== null) {
    consumed += match[0].length;
    const isClosing = match[0].charAt(1) === "/";
    const selfClosing = match[3] === "/";
    if (selfClosing) continue;
    if (isClosing) {
      if (stack.pop() !== match[1]) return false;
    } else {
      stack.push(match[1]);
    }
  }

  if (consumed === 0) return false;
  return stack.length === 0;
}

console.log("\n=== Site scripts ===");

const scriptDir = path.join(ROOT, "provisioning", "site-scripts");
const scriptFiles = walk(scriptDir, ".json");
const allGuids = new Map();
const listNames = [];

scriptFiles.forEach((file) => {
  const rel = path.relative(ROOT, file);
  const raw = fs.readFileSync(file, "utf8");

  let doc;
  try {
    doc = JSON.parse(raw);
  } catch (e) {
    fail(`${rel} : JSON invalide — ${e.message}`);
    return;
  }

  if (!Array.isArray(doc.actions)) {
    fail(`${rel} : propriete "actions" manquante`);
    return;
  }

  if (doc.actions.length > 300) {
    fail(`${rel} : ${doc.actions.length} actions (max 300)`);
  }

  let fieldCount = 0;

  const checkVerb = (item, where) => {
    if (!VALID_VERBS.has(item.verb)) {
      fail(`${rel} : verbe inconnu "${item.verb}" dans ${where}`);
    }
    if (item.verb === "addSPFieldXml") {
      fieldCount++;
      if (!isWellFormedXml(item.schemaXml || "")) {
        fail(`${rel} : schemaXml mal forme dans ${where}`);
      }
    }
    if (item.verb === "addSPField") {
      fieldCount++;
      if (!item.internalName) {
        warn(`${rel} : addSPField "${item.displayName}" sans internalName`);
      } else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(item.internalName)) {
        fail(`${rel} : internalName invalide "${item.internalName}"`);
      }
    }
  };

  doc.actions.forEach((action) => {
    checkVerb(action, "action racine");
    if (action.verb === "createSPList") {
      listNames.push(action.listName);
      if (!/^[A-Za-z][A-Za-z0-9]*$/.test(action.listName)) {
        warn(`${rel} : nom de liste avec caracteres speciaux "${action.listName}"`);
      }
    }
    (action.subactions || []).forEach((sub) =>
      checkVerb(sub, `liste ${action.listName || "?"}`)
    );
  });

  (raw.match(GUID_RE) || []).forEach((guid) => {
    const key = guid.toLowerCase();
    if (!allGuids.has(key)) allGuids.set(key, []);
    allGuids.get(key).push(rel);
  });

  ok(`${rel} — ${doc.actions.length} actions, ${fieldCount} champs`);
});

console.log("\n=== Unicite des GUIDs ===");
let dupes = 0;
allGuids.forEach((files, guid) => {
  if (files.length > 1) {
    fail(`GUID duplique ${guid} dans ${files.join(", ")}`);
    dupes++;
  }
});
if (dupes === 0) ok(`${allGuids.size} GUIDs, tous uniques`);

console.log("\n=== Manifests et configuration ===");
[
  path.join(ROOT, "config", "package-solution.json"),
  path.join(ROOT, "config", "serve.json"),
]
  .concat(walk(path.join(ROOT, "src"), ".manifest.json"))
  .forEach((file) => {
    if (!fs.existsSync(file)) {
      warn(`${path.relative(ROOT, file)} absent`);
      return;
    }
    try {
      JSON.parse(fs.readFileSync(file, "utf8"));
      ok(path.relative(ROOT, file));
    } catch (e) {
      fail(`${path.relative(ROOT, file)} : ${e.message}`);
    }
  });

console.log("\n=== Listes declarees ===");
console.log(`  ${listNames.length} listes : ${listNames.join(", ")}`);

console.log("\n=== Resultat ===");
console.log(`  Erreurs    : ${errors}`);
console.log(`  Avertissements : ${warnings}`);

process.exit(errors > 0 ? 1 : 0);
