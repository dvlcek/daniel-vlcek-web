import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { realpath, stat, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const preview = path.join(root, "tools/design-preview");
const portIndex = process.argv.indexOf("--port");
const port = portIndex === -1 ? 3105 : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error("Use --port with a number between 1024 and 65535.");
}
if (Number(process.versions.node.split(".")[0]) < 24) {
  throw new Error("Use Node.js 24 LTS for this project.");
}
try {
  for (const name of ["dashboard.webp", "cashflow.webp", "priorities.webp"]) {
    await access(path.join(preview, "private-media", name));
  }
} catch {
  throw new Error("Local FinanceOS review media is missing. Extract the private transfer ZIP described in docs/PC_HANDOFF.md. These assets are intentionally excluded from public Git.");
}

const folders = {
  images: await realpath(path.join(root, "public/images")),
  "qa-media": await realpath(path.join(preview, "private-media")),
};
const mime = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".avif": "image/avif", ".gif": "image/gif" };
const assets = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405).end(); return; }
    const [, folder, ...parts] = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname).split("/");
    const base = folders[folder];
    if (!base) { response.writeHead(404).end(); return; }
    const filename = await realpath(path.resolve(base, ...parts));
    if (!filename.startsWith(base + path.sep) || !mime[path.extname(filename).toLowerCase()]) {
      response.writeHead(404).end(); return;
    }
    const info = await stat(filename);
    if (!info.isFile()) { response.writeHead(404).end(); return; }
    response.writeHead(200, { "Content-Type": mime[path.extname(filename).toLowerCase()], "Content-Length": info.size, "X-Robots-Tag": "noindex, nofollow, noarchive", "X-Content-Type-Options": "nosniff" });
    if (request.method === "HEAD") response.end();
    else createReadStream(filename).on("error", () => response.destroy()).pipe(response);
  } catch { response.writeHead(404).end(); }
});
await new Promise((resolve, reject) => { assets.once("error", reject); assets.listen(0, "127.0.0.1", resolve); });

// Do not pass database, OAuth, email, admin or other inherited application secrets.
const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => /^(path|systemroot|windir|temp|tmp|userprofile|appdata|localappdata|homedrive|homepath|home|lang|lc_all|term|colorterm)$/i.test(key)));
environment.NODE_ENV = "development";
environment.NEXT_TELEMETRY_DISABLED = "1";
environment.DESIGN_PREVIEW_ASSET_ORIGIN = `http://127.0.0.1:${assets.address().port}`;

console.log(`Local design preview: http://127.0.0.1:${port}`);
console.log("Synthetic review media; APIs disconnected; production publication gates unchanged.");
const child = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "dev", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: preview, env: environment, stdio: "inherit" });
const close = () => { assets.close(); assets.closeAllConnections(); };
child.once("error", error => { console.error(error.message); close(); process.exitCode = 1; });
child.once("exit", code => { close(); process.exitCode = code ?? 1; });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => { child.kill(signal); close(); });
