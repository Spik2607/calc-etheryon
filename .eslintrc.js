module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/jsx-no-undef": "off",
    "react/prop-types": "off"
  },
  ignorePatterns: ["**/*.test.js", "**/*.spec.js"]
};
