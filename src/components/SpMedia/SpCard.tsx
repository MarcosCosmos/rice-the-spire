import type { CSSProperties, ReactNode } from "react";
import { resolveSpireImage } from "../../util";
import "./SpCard.css";
export interface CardProps {
  name: string;
}
export type BannerType = "normal" | "ancient";
export type FrameType = "normal" | "quest" | "ancient";
export type PortraitType = "skill" | "attack" | "power" | "none";
export type CardType = "attack" | "skill" | "power" | "status" | "curse";

interface FrameDetail {
  width: number;
  height: number;
}

interface BannerDetail extends FrameDetail {
  y: number;
}

// interface PortaitDetail extends FrameDetail {
//   y_offset: number; //relative to the banner position
// }
const frames: Record<FrameType, FrameDetail> = {
  normal: {
    width: 598,
    height: 894,
  },
  ancient: {
    width: 618,
    height: 862,
  },
  quest: {
    width: 599,
    height: 844,
  },
};
const banners: Record<BannerType, BannerDetail> = {
  normal: {
    width: 653,
    height: 145,
    y: 30,
  },
  ancient: {
    width: 671,
    height: 182,
    y: 0,
  },
};

const portraits = {
  normal: {
    width: 551,
    height: 420,
    y_offset: 70,
  },

  // todo: portrait anatomy for other frames
};

const plaqueDetail = {
  width: 123,
  height: 75,
  y_offset: -90, // relative to the bottom of the portrait
};

export interface SpCardProps {
  className?: string;
  children?: ReactNode;
}
export const SpCard = ({ className, children }: SpCardProps) => {
  className ??= "";
  const frame = {
    href: resolveSpireImage("ui/compendium/card/card_frame_attack_s"),
    x: (banners.normal.width - frames.normal.width) / 2,
    y: 0,
  };
  const banner = {
    href: resolveSpireImage("ui/compendium/card/card_banner"),
    x: 0,
    y: banners.normal.y,
  };
  const border = {
    href: resolveSpireImage("ui/compendium/card/card_portrait_border_attack_s"),
    x: (banners.normal.width - portraits.normal.width) / 2,
    y: banner.y + portraits.normal.y_offset,
  };
  const plaque = {
    href: resolveSpireImage("ui/compendium/card/card_portrait_border_plaque_s"),
    x: (banners.normal.width - plaqueDetail.width) / 2,
    y: border.y + portraits.normal.height + plaqueDetail.y_offset,
  };

  const viewBox = {
    width: banners.normal.width,
    height: frames.normal.height,
  };

  const style: CSSProperties = {
    "--card-scale": `calc(1.5rem / ${plaqueDetail.height.toFixed(0)}px)`,
    "--base-width": `${viewBox.width.toFixed(0)}px`,
    "--base-height": `${viewBox.height.toFixed(0)}px`,
  } as CSSProperties;

  // TODO: MAYBE SHOW ARTIST IN A SUB BANNER?

  return (
    <div className={`card ${className}`} style={style}>
      <svg
        viewBox={`0 0 ${viewBox.width.toFixed(0)} ${viewBox.height.toFixed(0)}`}
      >
        <image className="card__frame" {...frame} />
        <image className="card__border" {...border} />
        <image className="card__banner" {...banner} />
        <image className="card__plague" {...plaque} />
      </svg>
      {children}
    </div>
  );
};
