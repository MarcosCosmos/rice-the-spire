import type { ReactNode } from "react";
import SpStretchBox from "../SpStretchBox";

export interface PlaqueProps {
  className?: string;
  children: ReactNode;
}
export const Plaque = ({ className, children }: PlaqueProps) => {
  className ??= "";
  return (
    <SpStretchBox
      className={`media-plaque ${className}`}
      path="ui/compendium/card/card_portrait_border_plaque_s"
      width={123}
      height={75}
      inset={30}
    >
      {children}
    </SpStretchBox>
  );
};
