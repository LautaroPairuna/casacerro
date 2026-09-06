import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next sólo hereda 6 reglas de jsx-a11y (alt-text y las de
  // aria). El set recomendado agrega las de teclado, roles y labels, que son
  // las que atrapan las regresiones de accesibilidad de verdad.
  //
  // Se toman sólo las `rules`: el plugin ya lo registra eslint-config-next y
  // ESLint no deja definir dos veces el mismo namespace.
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cliente de Prisma generado.
    "generated/**",
  ]),
]);

export default eslintConfig;
