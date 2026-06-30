import type { ReactNode } from "react";
import SpStretchBox from "../SpStretchBox";
import type { BannerColor } from "../../contexts";

export interface PlaqueProps {
  className?: string;
  color: BannerColor;
  children?: ReactNode;
}
export const Plaque = ({ className, color, children }: PlaqueProps) => {
  className ??= "";
  return (
    <SpStretchBox
      className={`media-plaque ${className}`}
      path={`card-frames/plaque_${color}`}
      width={123}
      height={75}
      inset={30}
    >
      {children}
    </SpStretchBox>
  );
};
