import { resolveSpireImage } from '../resolveSpireImage';

const SpireImage = ({ className, path, ...attrs }) => {
  className ||= '';
  return (
    <img className={`spire-codex-image ${className}`} src={resolveSpireImage(path)} {...attrs} />
  );
};

export default SpireImage;
