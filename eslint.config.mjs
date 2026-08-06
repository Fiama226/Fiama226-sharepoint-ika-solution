import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // SPFx is a *separate* project with its own toolchain, React version and
    // ESLint config. Do NOT lint it with Next/React 19 rules.
    "spfx/**",
    // Build output / generated
    "node_modules/**",
    "design-references/**",
    "sharepoint-ready-data/**",
  ]),
]);

export default eslintConfig;
