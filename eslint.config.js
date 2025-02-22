import angularEslintTemplate from "@angular-eslint/eslint-plugin-template";
import angularTemplateParser from "@angular-eslint/template-parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  },
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplateParser
    },
    plugins: {
      "@angular-eslint/template": angularEslintTemplate
    },
    rules: {}
  }
];
