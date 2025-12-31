import globals from "globals";
("use strict");

const js = require("@eslint/js");
const importPlugin = require("eslint-plugin-import");
const sonarjs = require("eslint-plugin-sonarjs");
const unicorn = require("eslint-plugin-unicorn");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    plugins: {
      import: importPlugin,
      sonarjs,
      unicorn,
    },
    rules: {
      "no-console": "off",
      "sonarjs/no-duplicate-string": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/no-process-exit": "off",
      complexity: ["warn", 8],
    },
  },
  {
    files: ["test/**/*.js"],
    rules: {
      "no-undef": "off",
    },
  },
];
