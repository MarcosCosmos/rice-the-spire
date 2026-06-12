import { useContext } from "react";
import SpireContext from "../../data/SpireContext";
const Workspaces = ({className, children, ...attrs}) => {
  className ||= '';
  const config = useContext(SpireContext);
  return (
    <div className={`workspaces workspaces--${config.act} ${className}`} role="region" aria-label={"Workspaces"} {...attrs}>
      <div className="workspaces__content">
        {children}
      </div>
    </div>
  );
};

export default Workspaces;