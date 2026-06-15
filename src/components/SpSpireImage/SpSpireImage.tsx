import resolveSpireImage from "../../util/resolveSpireImage";
import "./SpSpireImage.css";

export interface SpSpireImageProps {
  className?: string;
  path: string;
}

const SpSpireImage = ({ className, path, ...attrs }: SpSpireImageProps) => {
  className ||= "";
  return (
    <img
      aria-hidden="true"
      className={`spire-image ${className}`}
      src={resolveSpireImage(path)}
      {...attrs}
    />
  );
};
export default SpSpireImage;
