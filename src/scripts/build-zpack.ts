import fs from "node:fs";
import baseZPack from "../zebar/zpack.json" with { type: "json" };
import { devImports, prodImports, transformHtml } from "./externals.ts";

const baseWidget = baseZPack.widgets[0];
const devSource = fs.readFileSync("./src/zebar/dev.html", "utf8");
const prodSource = fs.readFileSync("./src/zebar/prod.html", "utf8");
const widgetFiles = fs.readdirSync("./src/zebar/widgets").map((x) => ({
  fileName: x,
  contents: fs.readFileSync(`./src/zebar/widgets/${x}`, "utf8"),
}));
const resultZPackWidgets = [
  {
    ...baseWidget,
    name: "dev",
    htmlPath: "dev.html",
    includeFiles: ["dev.html", "assets/**"],
  },
];

for (const { fileName, contents } of widgetFiles) {
  const [shortName] = fileName.toLowerCase().split(".");
  const prodHtml = transformHtml(prodSource, prodImports, contents);
  fs.writeFileSync(`dist/prod-${shortName}.html`, prodHtml);
  resultZPackWidgets.push({
    ...baseWidget,
    name: `prod-${shortName}`,
    htmlPath: `prod-${shortName}.html`,
    includeFiles: [`prod-${shortName}.html`, "assets/**"],
  });
}

const resultZPack = { ...baseZPack, widgets: resultZPackWidgets };
fs.writeFileSync("dist/zpack.json", JSON.stringify(resultZPack, null, 2));
fs.writeFileSync(`dist/dev.html`, transformHtml(devSource, devImports));
