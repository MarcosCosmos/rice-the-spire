export default (path: string) => {
  const splitPoint = path.lastIndexOf("/");
  let [category, entry] = [
    path.substring(0, splitPoint),
    path.substring(splitPoint + 1),
  ];
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
  return `https://cdn.spire-codex.com/${category}/${key}.webp`;
};
