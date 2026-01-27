//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import oxlint from "eslint-plugin-oxlint";

export default [
  ...pluginQuery.configs["flat/recommended"],
  ...tanstackConfig,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // oxlint should be the last one
  ...oxlint.configs["flat/recommended"],
];
