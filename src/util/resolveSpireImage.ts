export default (path: string) => {
  let [category, subcategory, entry] = path.split("/");
  if (!entry) {
    entry = subcategory;
    subcategory = "";
  }
  let key = entry;
  switch (category) {
    case "cards-full":
      category += "/stable";
      key = entry;
      break;
    case "powers":
    case "orbs":
      if (entry === "empty_slot") {
        break;
      } else {
        key = `${entry}_${category.slice(0, -1)}`;
        break;
      }
  }
  const dir = (subcategory && [category, subcategory].join("/")) || category;
  return `https://cdn.spire-codex.com/${dir}/${key}.webp`;
};
