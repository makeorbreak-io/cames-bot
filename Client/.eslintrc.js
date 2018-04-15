module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },

  "extends": "eslint:recommended",

  "parser": "babel-eslint",

  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
      "modules": true,
    },
    "sourceType": "module"
  },

  "plugins": [
    "react",
  ],

  "rules": {
    "comma-dangle": [ "error", "always-multiline" ],
    "indent": [ "error", 2, { "MemberExpression": 0 } ],
    "linebreak-style": [ "error", "unix" ],
    "no-console": ["warn", { "allow": ["error"] }],
    "no-debugger": "warn",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "quotes": [ "error", "double" ],
    "semi": [ "error", "always" ],

    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
};
