import { useContext, useEffect, useState } from "react";
import {
  type BannerColor,
  SpireContext,
  useNavigationGroup,
  ZebarContext,
} from "../../contexts";
import SpSpireImage from "../SpSpireImage";
import "./SpMedia.css";
import { SpButton } from "../SpButton/SpButton";
import SpNote from "../SpNote";
import SpOutlinedText from "../SpOutlinedText";
import SpTooltip from "../SpTooltip";
import { MediaProgress } from "./MediaProgress";

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

    // todo: this needs improved accessibility that I haven't quite figured out yet; might have to refer to some examples!
    // toolbar is probably not quite right

    return (
      <div
        className={`media media--banner-${bannerColor} anchor-tooltips-block-end ${className}`}
        role="complementary"
        aria-label="Media Player"
        {...navAttrs}
      >
        <SpSpireImage
          className="media__background"
          path={`card-frames/banner_${bannerColor}`}
        />
        <div className="media__content">
          <div className="media__track-info">
            <SpTooltip
              anchor={(tooltipId: string) => (
                <SpNote
                  aria-label="Song"
                  aria-describedby={tooltipId}
                  aria-live="polite"
                  aria-relevant="text"
                >
                  <SpOutlinedText>
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
          <MediaProgress className="media__progress" color={bannerColor} />
          <div className="media__controls">
            <SpButton className="media__previous" onClick={onPrevious}>
              <SpOutlinedText>⏮</SpOutlinedText>
            </SpButton>
            <SpButton className="media__toggle-play" onClick={onToggle}>
              <SpOutlinedText>
                {currentSession.isPlaying ? "⏸" : "⏵"}
              </SpOutlinedText>
            </SpButton>
            <SpButton className="media__next" onClick={onNext}>
              <SpOutlinedText>⏭</SpOutlinedText>
            </SpButton>
          </div>
        </div>
      </div>
    );
  }
};
