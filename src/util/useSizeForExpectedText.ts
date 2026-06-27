import { useState, useEffect, type CSSProperties } from "react";
import { measureTextWidth } from "./measureText";

/**
 * /**
 * A small utility to avoid components moving or resizing when text dynamically changes
 * Note: an effect will run whenever the parameters change so if you have multiple samples but they are static, store them in a const outside of your 'pure' component render.
 * @param font canvas API font shorthand
 * @param extraWidth extra width (total) to account for any padding etc, specified as a CSS expression to be used in calc() if present; e.g. var(--text-stroke-width) to account for the padding that SpOutlinedText applies to cater for the outline.
 * @param textSamples text expected to be the longest in the target font; multiple can be supplied for comparison.
 * @return a CSSProperties object with a min-width that will be sufficient to hold the suggested text
 * based on predictions of the longest
 */
export const useSizeForExpectedText = (
  samples: string | string[],
  font: string,
  extraWidth?: string,
): CSSProperties => {
  const samplesToRun = typeof samples === "string" ? [samples] : samples;

  const [result, setResult] = useState<CSSProperties>({});
  useEffect(() => {
    const width = Math.max(
      ...samplesToRun.map((sample) => measureTextWidth(sample, font)),
    );
    setResult({
      minWidth: extraWidth
        ? `calc(${width.toString()}px + ${extraWidth})`
        : `${width.toString()}px`,
    });
  }, [font, extraWidth, samples]);
  return result;
};
