import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ここでルールを上書きします
  {
    rules: {
      // 未使用の変数に関して、変数名が "_" で始まるものは許可
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],

      // any の使用を許可（完全に許可するなら 'off'、警告にとどめるなら 'warn'）
      "@typescript-eslint/no-explicit-any": "warn",

      // require を許可（または 'warn' に変更して検出のみ）
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
