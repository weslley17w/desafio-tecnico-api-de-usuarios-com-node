import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import pluginJest from 'eslint-plugin-jest';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { files: ['**/*.spec.{js,mjs,cjs,ts,mts,cts}'], plugins: { jest: pluginJest }, languageOptions: { globals: pluginJest.configs.recommended.globals } },
  { files: ['**/*.spec.{js,mjs,cjs,ts,mts,cts}'], extends: ['plugin:jest/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  tseslint.configs.recommended,
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
]);
