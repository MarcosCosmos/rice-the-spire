import {
  useState,
  useEffect,
  type RefCallback,
  useCallback,
  type CSSProperties,
} from "react";
import { measureTextWidth } from "./measureText";

/**
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
): { style: CSSProperties; ref: RefCallback<HTMLElement> } => {
  const samplesToRun = typeof samples === "string" ? [samples] : samples;
  const [fontToUse, setFontToUse] = useState<string>("");
  const [extraSize, setExtraSize] = useState<string>("0px");

  if (fontToUse === "") {
    // start with the default font of the whole page so we have something to work with
    setFontToUse(getComputedStyle(document.body).font);
  }
  const refCallback = useCallback((target: HTMLElement | null) => {
    if (target) {
      const styles = getComputedStyle(target);
      setFontToUse(styles.font);
      if (styles.boxSizing === "border-box") {
        setExtraSize(
          `${styles.paddingInlineStart} + ${styles.paddingInlineEnd}`,
        );
      } else {
        setExtraSize("0px");
      }
    }
  }, []);

  const [loaded, setLoaded] = useState<boolean>(false);
  if (!loaded) {
    if (document.fonts.status === "loaded") {
      setLoaded(true);
    } else {
      void (async () => {
        try {
          await document.fonts.ready;
          setLoaded(true);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }

  const [minInlineSize, setMinInlineSize] = useState<string>("");
  useEffect(() => {
    if (loaded) {
      const width = Math.max(
        ...samplesToRun.map((sample) => measureTextWidth(sample, fontToUse)),
      );
      setMinInlineSize(`calc(${width.toString()}px + ${extraSize})`);
    }
  }, [fontToUse, loaded, extraSize, samples]);
  return {
    style: { minInlineSize },
    ref: refCallback,
  };
};
