// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
    rules: {
        eqeqeq: "error",
        "no-unused-vars": "off",
        "no-shadow": "warn",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "error",
    },
});
