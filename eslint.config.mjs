// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { FlatCompat } from "@eslint/eslintrc";

// You'll need to install these if not already present based on your create-next-app prompts
// npm install --save-dev eslint-plugin-prettier eslint-config-prettier
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
  ...compat.config(pluginReactConfig),
  ...compat.config({
    extends: [
      "next",
      "next/core-web-vitals",
    ],
  }),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          "endOfLine": "auto"
        }
      ],
      // Add any custom ESLint rules here
      // For example, if you want to turn off a rule:
      // "@typescript-eslint/no-unused-vars": "off",
    },
  },
  prettierConfig, // This must be the LAST item to ensure it turns off conflicting rules
];