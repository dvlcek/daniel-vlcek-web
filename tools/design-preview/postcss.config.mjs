import path from "node:path";
import { fileURLToPath } from "node:url";

const postcssConfig = {
  plugins: {
    "@tailwindcss/postcss": { base: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..") },
  },
};

export default postcssConfig;
