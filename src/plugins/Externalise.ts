import packageLock from "../../package-lock.json";
type PackageName = keyof typeof packageLock.packages;
const targets = Object.keys(packageLock.packages[""].dependencies);
const commonImports = Object.fromEntries(
  targets.flatMap((name) => {
    const path = ("node_modules/" + name) as PackageName;
    const version = packageLock.packages[path].version;
    return [
      [name, `https://esm.sh/${name}@${version}`],
      [`${name}/`, `https://esm.sh/${name}@${version}/`],
    ];
  }),
);

const productionImports = {
  "@rice-the-spire": "./assets/index.js",
  "@rice-the-spire/widgets": "./assets/widgets.js",
};

const devImports = {
  "@react-refresh": "http://127.0.0.1:5173/@react-refresh",
  "@vite/client": "http://127.0.0.1:5173/@vite/client",
  "@rice-the-spire": "http://127.0.0.1:5173/src/index.ts",
  "@rice-the-spire/widgets": "http://127.0.0.1:5173/src/widgets/index.ts",
};

export const externalsRegex = new RegExp(
  `(${targets.map((x) => `^${x}`).join("|")}|^@rice-the-spire)(/.*)?`,
);

const plugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html: string, { filename }: { filename: string }) {
      const fullImports = {
        imports: {
          ...commonImports,
          ...(filename.endsWith("dev.html") ? devImports : productionImports),
        },
      };
      const json = JSON.stringify(fullImports, null, 2);
      return html.replace(
        "<!-- import map -->",
        `<script type="importmap">
${json}
    </script>
`,
      );
    },
  };
};
export default plugin;
