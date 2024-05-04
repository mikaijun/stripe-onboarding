/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ["eslint:recommended", "next/core-web-vitals", "prettier"],
  plugins: ["@typescript-eslint", "import", "no-relative-import-paths"],
  root: true,
  rules: {},
};
