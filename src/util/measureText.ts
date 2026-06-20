const canvas = document.createElement("canvas");

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export const measureTextWidth = (text: string, font: string): number => {
  // re-use canvas object for better performance
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const context = canvas.getContext("2d")!;
  context.font = font;
  const measure = context.measureText(text);
  return measure.actualBoundingBoxRight - measure.actualBoundingBoxLeft;
};

// some prebake we will use a lot in this bar

export const widestDigit = [
  ...Array(10)
    .keys()
    .map((n: number) => n.toString())
    .map((n) => ({ char: n, width: measureTextWidth(n, "400 17px Kreon") })),
].sort(({ width: widthA }, { width: widthB }) => widthB - widthA)[0].char;

export const widestUnitChar = ["K", "M", "G", "T"]
  .map((n) => ({ char: n, width: measureTextWidth(n, "400 17px Kreon") }))
  .sort(({ width: widthA }, { width: widthB }) => widthB - widthA)[0].char;
console.log(widestDigit, widestUnitChar);