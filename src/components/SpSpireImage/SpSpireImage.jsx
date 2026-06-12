import resolveSpireImage from "../../util/resolveSpireImage";

const SpSpireImage = ({ className, path, ...attrs }) => {
  className ||= "";
  return (
    <img
      className={`spire-codex-image ${className}`}
      src={resolveSpireImage(path)}
      {...attrs}
    />
  );
};
export default SpSpireImage;
