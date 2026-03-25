import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended, { uncommit when you done writing frontend }
  {
    rules : {
      "no-var": "warn",
      "no-undef": "warn",
      "no-const-assign": "error",
      "no-dupe-args": "warn",
      "no-duplicate-imports": "error",
      "no-irregular-whitespace": "warn",
      "no-unassigned-vars": "warn",
      "no-unreachable": "error",
      "no-unused-private-class-members": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "error"
    }
  }
]);
