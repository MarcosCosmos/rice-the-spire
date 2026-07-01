import { useState } from "react";

export interface Dimensions {
  width: number;
  height: number;
}
export const measureImages = async <T extends string>(
  ...sources: T[]
): Promise<Record<T, Dimensions>> => {
  console.log("got sources", sources);
  const promises: Promise<[T, Dimensions]>[] = sources.map(
    (url) =>
      new Promise((resolve, reject) => {
        console.log("loading image for", url);
        const img = new Image();
        img.addEventListener("load", () => {
          resolve([
            url,
            { width: img.naturalWidth, height: img.naturalHeight },
          ]);
        });
        img.addEventListener("error", (event: ErrorEvent) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(event.error);
        });
        img.src = url;
      }),
  );
  const results = await Promise.allSettled(promises);
  if (results.some(({ status }) => status === "rejected")) {
    console.error("Failed not resolve some images. Detailed results:", results);
    throw new Error("Failed not resolve some images, see console for details");
  } else {
    return Object.fromEntries(
      results.map(
        (result) =>
          (result as unknown as PromiseFulfilledResult<[T, number]>).value,
      ),
    ) as unknown as Record<T, Dimensions>;
  }
};

export const useMeasureImages = <T extends string>(
  ...sources: T[]
): Record<T, Dimensions> | undefined => {
  type key = (typeof sources)[number];
  const [result, setResult] = useState<Record<key, Dimensions> | undefined>(
    undefined,
  );
  if (!result) {
    void (async () => {
      try {
        setResult(await measureImages(...sources));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // already logged
      }
    });
  }
  return result;
};
