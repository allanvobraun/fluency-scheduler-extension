import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import { configs as litConfigs } from 'eslint-plugin-lit';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/**', 'node_modules/**']),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      ...litConfigs['flat/recommended'].plugins,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...litConfigs['flat/recommended'].rules,
      complexity: ['error', 8],
      'max-depth': ['error', 3],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
