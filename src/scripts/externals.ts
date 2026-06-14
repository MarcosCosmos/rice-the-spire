import packageLock from "../../package-lock.json" with { type: "json" };
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

export const prodImports = {
  ...commonImports,
  "@rice-the-spire": "./assets/rice-the-spire.js",
};

export const devImports = {
  ...commonImports,
  "@react-refresh": "http://127.0.0.1:5173/@react-refresh",
  "@vite/client": "http://127.0.0.1:5173/@vite/client",
  "@rice-the-spire": "http://127.0.0.1:5173/src/index.ts",
  "@rice-the-spire/widgets/": "http://127.0.0.1:5173/src/zebar/widgets/",
};

export const externalsRegex = new RegExp(
  `(${targets.map((x) => `^${x}`).join("|")}|^@rice-the-spire)(/.*)?`,
);

export const transformHtml = (
  html: string,
  imports: Record<string, string>,
  widget?: string,
) => {
  const fullImports = {
    imports,
  };
  const json = JSON.stringify(fullImports, null, 2);
  if (widget) {
    html = html.replace("{widget}", widget);
  }

  return html.replace(
    "<!-- import map -->",
    `<script type="importmap">
${json}
    </script>
`,
  );
};