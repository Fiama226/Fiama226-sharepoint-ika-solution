#!/usr/bin/env node
"use strict";

/**
 * Tests unitaires sans Jest ni TypeScript.
 */

const assert = require("assert");
const path = require("path");

const imageUrl = require(path.join(
  __dirname,
  "..",
  "src",
  "common",
  "utils",
  "imageUrl.js"
));

let failed = 0;
let passed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  OK       ${name}`);
  } catch (error) {
    failed++;
    console.error(`  ERREUR   ${name}`);
    console.error(`           ${error.message}`);
  }
}

const previousWindow = global.window;
global.window = { location: { origin: "https://ikasolution.sharepoint.com" } };

console.log("\n=== buildImageUrl / parseImageField ===");

test("parse JSON string from modern Image column", () => {
  const json = JSON.stringify({
    fileName: "hero.jpg",
    serverUrl: "https://ikasolution.sharepoint.com",
    serverRelativeUrl: "/sites/ikareview/SiteAssets/Lists/xx/hero.jpg",
  });
  const url = imageUrl.buildImageUrl(json);
  assert.strictEqual(
    url,
    "https://ikasolution.sharepoint.com/sites/ikareview/SiteAssets/Lists/xx/hero.jpg"
  );
});

test("does not wrap Unsplash / absolute http URLs in getpreview.ashx", () => {
  const url = imageUrl.buildImageUrl(
    { serverUrl: "https://images.unsplash.com/photo-123?w=600" },
    400
  );
  assert.strictEqual(url, "https://images.unsplash.com/photo-123?w=600");
  assert.ok(url.indexOf("getpreview.ashx") === -1);
});

test("keeps data URI intact (mock hero slides)", () => {
  const data = "data:image/svg+xml,%3Csvg%3E%3C/svg%3E";
  assert.strictEqual(imageUrl.buildImageUrl(data, 600), data);
});

test("resolves FileRef server-relative path against window.origin", () => {
  const url = imageUrl.buildImageUrl(
    "/sites/ikareview/Galerie/team photo.jpg",
    600
  );
  assert.strictEqual(
    url,
    "https://ikasolution.sharepoint.com/sites/ikareview/Galerie/team%20photo.jpg"
  );
  assert.ok(url.indexOf("getpreview.ashx") === -1);
});

test("Hyperlink/Picture field { Url }", () => {
  const url = imageUrl.buildImageUrl({ Url: "https://cdn.example.com/a.png" });
  assert.strictEqual(url, "https://cdn.example.com/a.png");
});

test("empty field returns empty string (no person.gif for news/gallery)", () => {
  assert.strictEqual(imageUrl.buildImageUrl(undefined), "");
  assert.strictEqual(imageUrl.parseImageField(null), "");
});

test("EncodedAbsUrl is used as-is", () => {
  const abs =
    "https://ikasolution.sharepoint.com/sites/ikareview/HeroSlides/slide1.jpg";
  assert.strictEqual(imageUrl.buildImageUrl(abs), abs);
});

console.log("\n=== shouldUseMockDataByDefault ===");

test("localhost defaults to mocks", () => {
  assert.strictEqual(imageUrl.shouldUseMockDataByDefault("localhost"), true);
});

test("hosted workbench (sharepoint.com) fetches lists", () => {
  assert.strictEqual(
    imageUrl.shouldUseMockDataByDefault("ikasolution.sharepoint.com"),
    false
  );
});

test("forced useMocks=true wins on SharePoint host", () => {
  assert.strictEqual(
    imageUrl.shouldUseMockDataByDefault("ikasolution.sharepoint.com", true),
    true
  );
});

test("forced useMocks=false wins on localhost", () => {
  assert.strictEqual(imageUrl.shouldUseMockDataByDefault("localhost", false), false);
});

if (previousWindow === undefined) {
  delete global.window;
} else {
  global.window = previousWindow;
}

console.log("\n=== Resultat ===");
console.log(`  Réussis   : ${passed}`);
console.log(`  Échecs    : ${failed}`);
process.exit(failed > 0 ? 1 : 0);
