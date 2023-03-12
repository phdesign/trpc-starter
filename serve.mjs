import esbuild from "esbuild";
import { createServer, request } from "http";

const ctx = await esbuild.context({
  banner: {
    js: ' (() => new EventSource("/esbuild").addEventListener("change", () => location.reload()))();',
  },
  bundle: true,
  entryPoints: ["src/index.tsx"],
  logLevel: "info",
  outfile: "src/public/js/index.js",
  sourcemap: true,
  write: false,
});

await ctx.watch();

const { host, port } = await ctx.serve({
  servedir: "src/public",
  port: 8001,
});

createServer((req, res) => {
  const { url, method, headers } = req;
  // forwardRequest forwards an http request through to esbuid.
  const forwardRequest = (path) => {
    const options = {
      hostname: host,
      port,
      path,
      method,
      headers,
    };

    const proxyReq = request(options, (proxyRes) => {
      if (proxyRes.statusCode === 404) {
        // If esbuild 404s the request, assume it's a route needing to
        // be handled by the JS bundle, so forward a second attempt to `/`.
        return forwardRequest("/");
      }

      // Otherwise esbuild handled it like a champ, so proxy the response back.
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });
  };

  // When we're called pass the request right through to esbuild.
  forwardRequest(url);
}).listen(8000);

console.log("Web server running on http://localhost:8000");
