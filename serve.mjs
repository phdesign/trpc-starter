import esbuild from "esbuild";
import { createServer, request } from "http";

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: ["src/index.tsx"],
  outfile: "src/public/js/index.js",
  sourcemap: true,
  banner: {
    js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();',
  },
});

await ctx.watch();

const { host, port } = await ctx.serve({
  servedir: "src/public",
  port: 8001,
});

createServer((req, res) => {
  const { url, method, headers } = req;
  const options = {
    hostname: host,
    port: port,
    path: ~url.split("/").pop().indexOf(".") ? url : "/index.html",
    method,
    headers,
  };
  req.pipe(
    request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }),
    { end: true }
  );
}).listen(8000);
