import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ["src/pixi-scenes.mjs"],
  bundle: true,
  minify: false,
  sourcemap: true,
  format: "esm",
  target: "es6",
  outdir: "dist",
  treeShaking: true,
  outExtension: { ".js": ".mjs" }
});
await esbuild.build({
  entryPoints: ["src/pixi-scenes.mjs"],
  bundle: true,
  minify: false,
  sourcemap: true,
  target: "es6",
  outdir: "dist",
  treeShaking: true,

});
await esbuild.build({
  entryPoints: ["src/pixi-scenes.mjs"],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: "esm",
  target: "es6",
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  treeShaking: true,
});
await esbuild.build({
  entryPoints: ["src/pixi-scenes.mjs"],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: "es6",
  outdir: "dist",
  treeShaking: true,
});