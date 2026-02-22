import nextPlugin from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...nextPlugin,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/immutability": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/refs": "off",
    },
  },
];
