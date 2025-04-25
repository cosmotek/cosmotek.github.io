const themeDir = __dirname + "/../../";

const purgecss = require("@fullhuman/postcss-purgecss")({
  // see https://gohugo.io/hugo-pipes/postprocess/#css-purging-with-postcss
  content: ["./hugo_stats.json"],
  defaultExtractor: (content) => {
    let els = JSON.parse(content).htmlElements;
    return els.tags.concat(els.classes, els.ids);
  },
  // Structural utilities toggled purely via JS (e.g. the film gallery
  // lightbox) can get dropped depending on build timing/ordering of
  // hugo_stats.json vs. this transform, since it's generated from the
  // previous build's rendered output. Safelist them explicitly rather
  // than rely on hugo_stats.json always being in sync.
  safelist: ["fixed", "inset-0", "z-50"],
});

module.exports = {
  plugins: [
    require("postcss-import")({
      path: [themeDir],
    }),
    require("tailwindcss")(themeDir + "assets/css/tailwind.config.js"),
    require("autoprefixer")({
      path: [themeDir],
    }),
  ],
};
