/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { CSSProperties } from "react";
import { resolveSpireImage } from "../../util";
import "./SpCard.css";
import SpOutlinedText from "../SpOutlinedText";
import SpStretchBox from "../SpStretchBox";
export interface CardProps {
  name: string;
}
export type Banner = "normal" | "ancient";
export type Frame = "normal" | "quest" | "ancient";
export type PortraitShape = "skill" | "attack" | "power" | "ancient";
export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "ancient"
  | "status"
  | "curse"
  | "event"
  | "quest";

interface PortraitColorDetail {
  titleStrokeColor: string;
  plaqueTextColor: string;
}

interface FrameDetail {
  width: number;
  height: number;
}

interface BannerDetail extends FrameDetail {
  y: number;
}

const portraitColors: Record<Rarity, PortraitColorDetail> = {
  uncommon: {
    titleStrokeColor: "#005c75",
    plaqueTextColor: "#1D3537",
  },
  common: {
    titleStrokeColor: "",
    plaqueTextColor: "",
  },
  rare: {
    titleStrokeColor: "",
    plaqueTextColor: "",
  },
  ancient: {
    titleStrokeColor: "",
    plaqueTextColor: "",
  },
  status: {
    titleStrokeColor: "",
    plaqueTextColor: "",
  },
  curse: {
    titleStrokeColor: "",
    plaqueTextColor: "",
  },
  event: {
    titleStrokeColor: "",
    plaqueTextColor: "",
  },
  quest: {
    titleStrokeColor: "",
    plaqueTextColor: "",
  },
};

const frames: Record<Frame, FrameDetail> = {
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
const banners: Record<Banner, BannerDetail> = {
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

// const portraits = {
//   normal: {
//     width: 551,
//     height: 420,
//     y_offset: 70,
//   },

//   // todo: portrait anatomy for other frames
// };

const plaqueDetail = {
  width: 123,
  height: 75,
  y_offset: -90, // relative to the bottom of the portrait
};

export interface SpCardProps {
  className?: string;
  title?: string;
  subtitle?: string;
  leftPlaque?: string;
  rightPlaque?: string;
}

export const SpCard = ({
  className,
  title,
  subtitle,
  leftPlaque,
  rightPlaque,
}: SpCardProps) => {
  className ??= "";
  // const cardArt = resolveSpireImage("cards/ashen_strike");
  // const frame = frames.normal;
  const banner = banners.normal;
  // const portrait = portraits.normal;
  const portraitColor = portraitColors.uncommon;
  const viewBoxProps = {
    width: banners.normal.width,
    height: frames.normal.height,
  };
  // const frameProps = {
  //   href: resolveSpireImage("ui/compendium/card/card_frame_attack_s"),
  //   x: (banner.width - frame.width) / 2,
  //   y: 0,
  //   // width: frame.width,
  //   // height: frame.height,
  // };
  const bannerProps = {
    href: resolveSpireImage("ui/compendium/card/card_banner"),
    x: 0,
    y: 0,
    // width: banner.width,
    // height: banner.height,
  };
  const subBannerProps = {
    href: resolveSpireImage("ui/compendium/card/card_banner"),
    x: (banner.width * 0.15) / 2,
    y: banner.height / 2,
    width: banner.width * 0.85,
    // height: banner.height,
  };
  // const portraitProps = {
  //   href: resolveSpireImage("ui/compendium/card/card_portrait_border_attack_s"),
  //   x: (banner.width - portrait.width) / 2,
  //   y: bannerProps.y + portrait.y_offset,
  //   // width: portrait.width,
  //   // height: portrait.height,
  // };
  const leftPlaqueProps = {
    href: resolveSpireImage("ui/compendium/card/card_portrait_border_plaque_s"),
    left: 0,
    // y: bannerProps.y + banner.height - plaqueDetail.height / 2,
    // width: plaqueDetail.width,
    // height: plaqueDetail.height,
  };

  const rightPlaqueProps = {
    href: resolveSpireImage("ui/compendium/card/card_portrait_border_plaque_s"),
    right: 0,
    // y: bannerProps.y + banner.height - plaqueDetail.height / 2,
    // width: plaqueDetail.width,
    // height: plaqueDetail.height,
  };

  const titleTopOffset = 10;
  const style: CSSProperties = {
    "--card-scale": `calc(var(--plaque-height) / ${plaqueDetail.height}px)`,
    "--base-width": `${viewBoxProps.width}px`,
    "--base-height": `${viewBoxProps.height}px`,
    "--title-top": `calc(var(--card-scale) * ${titleTopOffset + bannerProps.y}px)`,
    "--subtitle-top": `calc(var(--card-scale) * ${titleTopOffset + bannerProps.y}px)`,
    // "--left-plaque-top": `calc(var(--card-scale) * ${leftPlaqueProps.y}px)`,
    "--left-plaque-left": `calc(var(--card-scale) * ${leftPlaqueProps.left}px)`,
    // "--right-plaque-top": `calc(var(--card-scale) * ${rightPlaqueProps.y}px)`,
    "--right-plaque-right": `calc(var(--card-scale) * ${rightPlaqueProps.right}px)`,
    "--title-stroke-color": portraitColor.titleStrokeColor,
    "--plaque-text-color": portraitColor.plaqueTextColor,
  } as CSSProperties;
  // TODO: MAYBE SHOW ARTIST IN A SUB BANNER?

  return (
    <div className={`card ${className}`} style={style}>
      <svg
        className="card__background"
        viewBox={`0 0 ${viewBoxProps.width} ${viewBoxProps.height}`}
        aria-hidden="true"
      >
        {/* <image
          x={portraitProps.x}
          y={bannerProps.y}
          height={portraits.normal.height}
          width={portraits.normal.width}
          href={cardArt}
        />
        <image className="card__frame" {...frameProps} />
        <image className="card__border" {...portraitProps} /> */}
        <image className="card__banner" {...bannerProps} />

        <image className="card__sub-banner" {...subBannerProps} />
      </svg>
      {title && (
        <div className="card__title">
          <SpOutlinedText>{title}</SpOutlinedText>
        </div>
      )}
      {subtitle && (
        <div className="card__subtitle">
          <SpOutlinedText>{subtitle}</SpOutlinedText>
        </div>
      )}
      {leftPlaque && (
        <SpStretchBox
          className="card__left-plaque"
          path="ui/compendium/card/card_portrait_border_plaque_s"
          width={123}
          height={75}
          inset={30}
        >
          <div className="card__plaque-interior">{leftPlaque}</div>
        </SpStretchBox>
      )}
      {rightPlaque && (
        <SpStretchBox
          className="card__right-plaque"
          path="ui/compendium/card/card_portrait_border_plaque_s"
          width={123}
          height={75}
          inset={30}
        >
          <div className="card__plaque-interior">{rightPlaque}</div>
        </SpStretchBox>
      )}
    </div>
  );
};
