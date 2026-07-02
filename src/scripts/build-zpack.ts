import fs from "node:fs";
import baseZPack from "../zebar/zpack.json" with { type: "json" };
import { devImports, prodImports, transformHtml } from "./externals.ts";
import rtsPackage from "../../package.json" with { type: "json" };

const baseWidget = baseZPack.widgets[0];

const resultZPackWidgets = [];

const [htmlSource, imports, useContent] =
  process.argv[2] === "--dev"
    ? [fs.readFileSync("./src/zebar/dev.html", "utf8"), devImports, false]
    : [fs.readFileSync("./src/zebar/prod.html", "utf8"), prodImports, true];

const widgetFiles = fs
  .readdirSync("./src/zebar/widgets")
  .filter((x) => x.endsWith(".tsx"));
for (const fileName of widgetFiles) {
  const [shortName] = fileName.split(".");
  const lowerCaseName = shortName.toLowerCase();
  const contents = useContent
    ? fs.readFileSync(`./src/zebar/widgets/${fileName}`, "utf8")
    : shortName;
  const resultHtml = transformHtml(htmlSource, imports, contents);
  fs.writeFileSync(`dist/${lowerCaseName}.html`, resultHtml);
  const { default: preset } = (await import(
    `../zebar/widgets/${shortName}.preset.json`,
    {
      with: { type: "json" },
    }
  )) as { default: object };
  resultZPackWidgets.push({
    ...baseWidget,
    name: lowerCaseName,
    htmlPath: `${lowerCaseName}.html`,
    includeFiles: [`${lowerCaseName}.html`, "assets/**"],
    presets: [preset],
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
