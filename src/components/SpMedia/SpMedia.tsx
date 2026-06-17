import SpOutlinedText from "../SpOutlinedText";
import { SpCard } from "./SpCard";
import "./SpMedia.css";

export const SpMedia = () => {
  return (
    <div className="media">
      <SpCard className="media__card">
        <SpOutlinedText className="media__text">Hello World</SpOutlinedText>
      </SpCard>
    </div>
  );
};
