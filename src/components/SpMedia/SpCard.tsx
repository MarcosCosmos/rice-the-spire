import { resolveSpireImage } from "../../util";
import "./SpCard.css";
export interface CardProps {
  name: string;
}

export const SpCard = ({ name }: CardProps) => {
  const path = resolveSpireImage(`cards-full/${name}`);
  return (
    <div className="card">
      <svg viewBox="45 51 325 447">
        <image href={path} x="0" y="0" width="400px" height="520px" />
      </svg>
    </div>
  );
};
