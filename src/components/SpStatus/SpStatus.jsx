import SpSpireImage from "../SpSpireImage";
import SpItemLabel from "../SpItemLabel";

const SpStatus = ({ className, path, children, ...attrs }) => {
  className ||= "";
  return (
    <div className={`status ${className}`} {...attrs}>
      {path && <SpSpireImage className="status__image" path={path} />}
      {children && <SpItemLabel>{children}</SpItemLabel>}
    </div>
  );
};

export default SpStatus;
