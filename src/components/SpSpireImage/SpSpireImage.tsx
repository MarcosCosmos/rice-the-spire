import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import resolveSpireImage from "../../util/resolveSpireImage";
import "./SpSpireImage.css";

export interface SpSpireImageProps extends DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> {
  className?: string;
  path: string;
  extension?: "webp" | "png";
}

export const SpSpireImage = ({
  className,
  path,
  extension,
  ...attrs
}: SpSpireImageProps) => {
  className ??= "";
  return (
    <img
      aria-hidden="true"
      className={`spire-image ${className}`}
      src={resolveSpireImage(path, extension)}
      {...attrs}
    />
  );
};
