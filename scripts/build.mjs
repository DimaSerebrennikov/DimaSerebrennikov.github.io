import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = resolve(projectRoot, "dist");
const clientDirectory = resolve(distDirectory, "client");
const serverDirectory = resolve(distDirectory, "server");

const sourceAssets = [
  { fileName: "index.html", contentType: "text/html; charset=utf-8" },
  { fileName: "style.css", contentType: "text/css; charset=utf-8" },
  { fileName: "data.js", contentType: "text/javascript; charset=utf-8" },
  { fileName: "app.js", contentType: "text/javascript; charset=utf-8" }
];

await rm(distDirectory, { recursive: true, force: true });
await mkdir(clientDirectory, { recursive: true });
await mkdir(serverDirectory, { recursive: true });

const assets = [];

for (const sourceAsset of sourceAssets) {
  const sourcePath = resolve(projectRoot, sourceAsset.fileName);
  const body = await readFile(sourcePath, "utf8");

  assets.push({
    path: `/${sourceAsset.fileName}`,
    body,
    contentType: sourceAsset.contentType
  });

  await writeFile(resolve(clientDirectory, sourceAsset.fileName), body);
}

const workerSource = `const assets = new Map(${JSON.stringify(
  assets.map((asset) => [asset.path, {
    body: asset.body,
    contentType: asset.contentType
  }])
)});

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" }
      });
    }

    const url = new URL(request.url);
    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const asset = assets.get(requestedPath);

    if (!asset) {
      return new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const headers = new Headers({
      "Content-Type": asset.contentType,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    });

    if (requestedPath === "/index.html") {
      headers.set("Cache-Control", "no-cache");
    } else {
      headers.set("Cache-Control", "public, max-age=3600");
    }

    return new Response(request.method === "HEAD" ? null : asset.body, {
      status: 200,
      headers
    });
  }
};
`;

await writeFile(resolve(serverDirectory, "index.js"), workerSource);

console.log(`Built ${sourceAssets.length} assets and the Sites worker.`);

