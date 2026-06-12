import SpSpireImage from "../SpSpireImage";
import SpItemLabel from "../SpItemLabel";
import type { ReactNode } from "react";
import "./SpPower.css";

export interface SpPowerProps {
  className?: string;
  path: string;
  children: ReactNode;
}

const SpPower = ({ className, path, children, ...attrs }: SpPowerProps) => {
  className ||= "";
  return (
    <div className={`power ${className}`} {...attrs}>
      {path && <SpSpireImage className="power__image" path={path} />}
      {children && <SpItemLabel>{children}</SpItemLabel>}
    </div>
  );
};

export default SpPower;
