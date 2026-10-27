import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const assetOrigin = process.env.DESIGN_PREVIEW_ASSET_ORIGIN;
if (!assetOrigin || !/^http:\/\/127\.0\.0\.1:\d+$/.test(assetOrigin)) {
  throw new Error("Start this local preview with npm run preview:design.");
}

const previewConfig = {
  devIndicators: false,
  distDir: "node_modules/.cache/design-preview",
  turbopack: {
    root: path.resolve(directory, "../.."),
    resolveAlias: { "@/lib/portfolio-navigation": "./navigation.js" },
  },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }];
  },
  async rewrites() {
    return ["images", "qa-media"].map(folder => ({
      source: `/${folder}/:path*`, destination: `${assetOrigin}/${folder}/:path*`,
    }));
  },
};

export default previewConfig;
