// Based on https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project

module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
};
