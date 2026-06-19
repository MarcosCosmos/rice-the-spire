import type { ReactNode } from "react";
import SpStretchBox from "../SpStretchBox";
import "./CardPlaque.css";

export interface CardPlaqueProps {
  className?: string;
  children: ReactNode;
}
export const CardPlaque = ({ className, children }: CardPlaqueProps) => {
  className ??= "";
  return (
    <SpStretchBox
      className={`card-plaque ${className}`}
      path="ui/compendium/card/card_portrait_border_plaque_s"
      width={123}
      height={75}
      inset={30}
    >
      {children}
    </SpStretchBox>
  );
};
