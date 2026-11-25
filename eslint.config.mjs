import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Existing legacy components. Refactor separately.
    files: [
      "src/app/booking/manage/ManageBookingClient.tsx",
      "src/components/admin/AdminTimeSelect.tsx",
      "src/components/booking/BookingWizard.tsx",
      "src/components/sections/problem/AnimatedStat.tsx"
    ],
    rules: {
      "react-hooks/set-state-in-effect": "warn"
    }
  },
  {
    files: [
      "src/app/booking/manage/ManageBookingClient.tsx"
    ],
    rules: {
      "@next/next/no-html-link-for-pages": "warn"
    }
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts"
  ])
]);

export default eslintConfig;
