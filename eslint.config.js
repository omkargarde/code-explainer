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
        project: "./tsconfig.json", // ✅ correct relative path
        tsconfigRootDir: import.meta.dirname, // ✅ works in flat config
      },
    },
  },
  ...oxlint.configs["flat/recommended"], // oxlint should be the last one
];
