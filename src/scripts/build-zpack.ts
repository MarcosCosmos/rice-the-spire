import fs from "node:fs";
import baseZPack from "../zebar/zpack.json" with { type: "json" };
import { devImports, prodImports, transformHtml } from "./externals.ts";
import rtsPackage from "../../package.json" with { type: "json" };

const baseWidget = baseZPack.widgets[0];

const resultZPackWidgets = [];

if (process.argv[2] === "--dev") {
  const devSource = fs.readFileSync("./src/zebar/dev.html", "utf8");

  const mediaSource = fs.readFileSync(
    "./src/zebar/media-player-full.html",
    "utf8",
  );

  resultZPackWidgets.push({
    ...baseWidget,
    name: "dev",
    htmlPath: "dev.html",
    includeFiles: ["dev.html", "assets/**"],
  });

  fs.writeFileSync(`dist/dev.html`, transformHtml(devSource, devImports));
  fs.writeFileSync(
    `dist/media-player-full.html`,
    transformHtml(mediaSource, devImports),
  );
}

const prodSource = fs.readFileSync("./src/zebar/prod.html", "utf8");
const widgetFiles = fs.readdirSync("./src/zebar/widgets").map((x) => ({
  fileName: x,
  contents: fs.readFileSync(`./src/zebar/widgets/${x}`, "utf8"),
}));

for (const { fileName, contents } of widgetFiles) {
  const [shortName] = fileName.toLowerCase().split(".");
  const prodHtml = transformHtml(prodSource, prodImports, contents);
  fs.writeFileSync(`dist/${shortName}.html`, prodHtml);
  resultZPackWidgets.push({
    ...baseWidget,
    name: shortName,
    htmlPath: `${shortName}.html`,
    includeFiles: [`${shortName}.html`, "assets/**"],
  });
}

const resultZPack = {
  name: rtsPackage.name,
  version: rtsPackage.version,
  description: rtsPackage.description,
  repositoryUrl: rtsPackage.homepage,
  tags: rtsPackage.keywords,
  ...baseZPack,
  widgets: resultZPackWidgets,
};
fs.writeFileSync("dist/zpack.json", JSON.stringify(resultZPack, null, 2));
