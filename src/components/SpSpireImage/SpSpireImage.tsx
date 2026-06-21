import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import resolveSpireImage from "../../util/resolveSpireImage";
import "./SpSpireImage.css";

export interface SpSpireImageProps extends DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> {
  className?: string;
  path: string;
}

export const SpSpireImage = ({
  className,
  path,
  ...attrs
}: SpSpireImageProps) => {
  className ??= "";
  return (
    <img
      aria-hidden="true"
      className={`spire-image ${className}`}
      src={resolveSpireImage(path)}
      {...attrs}
    />
  );
};
