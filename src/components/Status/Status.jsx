import { SpireImage } from "../";
import { ItemLabel } from "../";

const Status = ({ className, path, children, ...attrs }) => {
  className ||= "";
  return (
    <div className={`status ${className}`} {...attrs}>
      {path && <SpireImage className="status__image" path={path} />}
      {children && <ItemLabel>{children}</ItemLabel>}
    </div>
  );
};

export default Status;
