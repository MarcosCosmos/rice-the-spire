export const resolveSpireImage = (path) => {
  let [category, subcategory, entry] = path.split("/");
  if (!entry) {
    entry = subcategory;
    subcategory = "";
  }
  let key;
  switch (category) {
    case "powers":
    case "orbs":
      if (entry === "empty_slot") {
        break;
      } else {
        key = `${entry}_${category.slice(0, -1)}`;
        break;
      }
    default:
      key = entry;
  }
  const dir = (subcategory && [category, subcategory].join("/")) || category;
  return `https://spire-codex.com/static/images/${dir}/${key}.webp`;
};

const SpireImage = ({ className, path, ...attrs }) => {
  className ||= "";
  return (
    <img
      className={`spire-codex-image ${className}`}
      src={resolveSpireImage(path)}
      {...attrs}
    />
  );
};
export default SpireImage;
