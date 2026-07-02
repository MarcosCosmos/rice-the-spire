import { useContext, useEffect, useState, type CSSProperties } from "react";
import {
  type BannerColor,
  SpireContext,
  useNavigationGroup,
  ZebarContext,
} from "../../contexts";
import "./SpMedia.css";
import { SpButton } from "../SpButton/SpButton";
import SpNote from "../SpNote";
import SpOutlinedText from "../SpOutlinedText";
import SpTooltip from "../SpTooltip";
import { SpMediaProgress } from "./SpMediaProgress";
import { resolveSpireImage } from "../../util";

export interface SpMediaProps {
  className?: string;
}

export const SpMedia = ({ className }: SpMediaProps) => {
  className ??= "";
  const spire = useContext(SpireContext);
  const navAttrs = useNavigationGroup();

  const [bannerColor, setBannerColor] = useState<BannerColor>("common");

  const zebar = useContext(ZebarContext);
  const currentSession = zebar?.media?.currentSession;

  useEffect(() => {
    setBannerColor(
      spire.bannerColors[Math.floor(Math.random() * spire.bannerColors.length)],
    );
  }, [currentSession?.sessionId, currentSession?.trackNumber]);

  if (currentSession) {
    const title = currentSession.title ?? "No Title";
    const artist = currentSession.artist ?? "Unknown Artist";

    const onPrevious = () => {
      zebar.media?.previous({ sessionId: currentSession.sessionId });
    };
    const onToggle = () => {
      if (currentSession.isPlaying) {
        zebar.media?.pause({ sessionId: currentSession.sessionId });
      } else {
        zebar.media?.play({ sessionId: currentSession.sessionId });
      }
    };

    const onNext = () => {
      zebar.media?.next({ sessionId: currentSession.sessionId });
    };

    const mediaStyles = {
      backgroundImage: `url(${resolveSpireImage(
        `card-frames/banner_${bannerColor}`,
      )})`,
    } as CSSProperties;

    // todo: this needs improved accessibility that I haven't quite figured out yet; might have to refer to some examples!
    // toolbar is probably not quite right

    return (
      <div
        className={`sp-media sp-media--banner-${bannerColor} anchor-tooltips-block-end ${className}`}
        role="complementary"
        aria-label="Media Player"
        style={mediaStyles}
        {...navAttrs}
      >
        <div className="sp-media__content">
          <div className="sp-media__track-info">
            <SpTooltip
              anchor={(tooltipId: string) => (
                <SpNote
                  className="sp-media__song"
                  aria-label="Song"
                  aria-describedby={tooltipId}
                  aria-live="polite"
                  aria-relevant="text"
                >
                  <SpOutlinedText className="sp-media__song-text">
                    <span>{title}</span> · <span>{artist}</span>
                  </SpOutlinedText>
                </SpNote>
              )}
              desc={
                <>
                  <strong>{title}</strong> by <strong>{artist}</strong> on album{" "}
                  <strong>{currentSession.albumTitle}</strong>
                </>
              }
            />
          </div>
          <SpMediaProgress className="sp-media__progress" color={bannerColor} />
          <div className="sp-media__controls">
            <SpButton className="sp-media__previous" onClick={onPrevious}>
              <SpOutlinedText>⏮</SpOutlinedText>
            </SpButton>
            <SpButton className="sp-media__toggle-play" onClick={onToggle}>
              <SpOutlinedText>
                {currentSession.isPlaying ? "⏸" : "⏵"}
              </SpOutlinedText>
            </SpButton>
            <SpButton className="sp-media__next" onClick={onNext}>
              <SpOutlinedText>⏭</SpOutlinedText>
            </SpButton>
          </div>
        </div>
      </div>
    );
  }
};
