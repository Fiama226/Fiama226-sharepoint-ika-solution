/**
 * Normalise un champ Image / Hyperlien / FileRef SharePoint.
 * Module JS pur (testable sans compilation).
 */

function parseImageField(field) {
  if (field === undefined || field === null || field === "") return "";

  if (typeof field === "string") {
    var trimmed = field.trim();
    if (trimmed.charAt(0) === "{") {
      try {
        return parseImageField(JSON.parse(trimmed));
      } catch (e) {
        return trimmed;
      }
    }
    return trimmed;
  }

  var relative = field.serverRelativeUrl;
  var server = field.serverUrl;

  if (relative) {
    if (/^https?:\/\//i.test(relative)) return relative;
    if (server && /^https?:\/\//i.test(server)) {
      var base = server.replace(/\/$/, "");
      return relative.charAt(0) === "/" ? base + relative : base + "/" + relative;
    }
    return relative;
  }

  return field.Url || field.url || field.fileUrl || field.serverUrl || "";
}

function encodePathSegments(path) {
  return path
    .split("/")
    .map(function (segment, index) {
      return index === 0 ? segment : encodeURIComponent(segment);
    })
    .join("/");
}

/**
 * Construit une URL affichable dans un <img>.
 * `width` est ignoré (compat) : getpreview.ashx n'accepte pas une largeur px.
 */
function buildImageUrl(field, _width) {
  var raw = parseImageField(field);
  if (!raw) return "";

  if (
    raw.indexOf("data:") === 0 ||
    raw.indexOf("blob:") === 0 ||
    /^https?:\/\//i.test(raw)
  ) {
    return raw;
  }

  if (raw.charAt(0) === "/") {
    var origin =
      typeof window !== "undefined" && window.location && window.location.origin
        ? window.location.origin
        : "";
    var encoded = encodePathSegments(raw);
    return origin ? origin + encoded : encoded;
  }

  return raw;
}

function shouldUseMockDataByDefault(hostname, forced) {
  if (forced !== undefined) return forced;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

module.exports = {
  parseImageField: parseImageField,
  buildImageUrl: buildImageUrl,
  shouldUseMockDataByDefault: shouldUseMockDataByDefault,
};
