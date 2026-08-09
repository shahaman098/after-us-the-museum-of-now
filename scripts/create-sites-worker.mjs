import { mkdir, writeFile } from "node:fs/promises";

const workerSource = `const ONE_YEAR = 31536000;

function withCacheHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  if (pathname.startsWith("/assets/")) {
    headers.set("cache-control", "public, max-age=" + ONE_YEAR + ", immutable");
  } else if (pathname === "/" || pathname.endsWith(".html")) {
    headers.set("cache-control", "public, max-age=0, must-revalidate");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) {
      return withCacheHeaders(asset, url.pathname);
    }

    if (request.method === "GET" && (request.headers.get("accept") || "").includes("text/html")) {
      const indexUrl = new URL("/index.html", url);
      const indexResponse = await env.ASSETS.fetch(new Request(indexUrl, request));
      return withCacheHeaders(indexResponse, "/index.html");
    }

    return asset;
  },
};
`;

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", workerSource);
