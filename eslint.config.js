//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...pluginQuery.configs['flat/recommended'],
  ...tanstackConfig,
  {
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
  },
]
