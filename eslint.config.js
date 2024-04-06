import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/*.json',
      '**/*.md',
    ],
  },
  {
    rules: {
      'no-console': 'warn',
      'no-alert': 'warn',
      'curly': 'off',
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'unused-imports/no-unused-vars': 'warn',
      'vue/max-attributes-per-line': ['warn', { singleline: 4, multiline: 1 }],
      'vue/singleline-html-element-content-newline': 'warn',
      'vue/no-multiple-template-root': 'warn',
    },
  },
)
