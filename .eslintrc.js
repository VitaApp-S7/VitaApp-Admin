module.exports = {
  // parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: { jsx: true } // Allows for the parsing of JSX
    
  },
  settings: { react: { version: "detect" }}// Tells eslint-plugin-react to automatically detect the version of React to use
  ,
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [ "react", "react-hooks" ],
  rules: {
    "prettier/prettier": 0,
    "no-unused-vars": [
      "error",
      {
        "ignoreRestSiblings": true,
        "destructuredArrayIgnorePattern": "[A-Z]",
        "caughtErrors": "none"
      }
    ],
    "react/prop-types": "off",
    "no-console": "warn",
    "no-debugger": "warn",
    "semi": [ "error", "never" ],
    "quotes": [ "error", "double" ],
    "indent": [ "error", 2 ],
    "object-property-newline": "error",
    "comma-dangle": [ "error", "never" ],
    "no-useless-computed-key": "error",
    "array-bracket-newline": [ "error", { "multiline": true }],
    "object-curly-newline": [ "error", { "multiline": true }],
    "object-curly-spacing": [
      "error",
      "always",
      {
        "arraysInObjects": false,
        "objectsInObjects": false
      }
    ],
    "array-bracket-spacing": [
      "error",
      "always",
      {
        "objectsInArrays": false,
        "arraysInArrays": false
      }
    ],
    "camelcase": [ "error", { "properties": "never" }],
    "prefer-template": "error",
    "import/no-unresolved": "off"
  }
}
