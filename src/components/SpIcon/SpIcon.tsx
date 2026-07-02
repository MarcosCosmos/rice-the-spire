import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import resolveSpireImage from "../../util/resolveSpireImage";
import "./SpIcon.css";

export interface SpSpireImageProps extends DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> {
  className?: string;
  path: string;
  extension?: "webp" | "png";
}

export const SpIcon = ({
  className,
  path,
  extension,
  ...attrs
}: SpSpireImageProps) => {
  className ??= "";
  return (
    <img
      aria-hidden="true"
      className={`sp-icon ${className}`}
      src={resolveSpireImage(path, extension)}
      {...attrs}
    />
  );
};
