import SpSpireImage from "../SpSpireImage";
import SpItemLabel from "../SpItemLabel";
import type { ReactNode } from "react";
import "./SpPower.css";

export interface SpPowerProps {
  className?: string;
  path: string | string[];
  children?: ReactNode;
}

export const SpPower = ({
  className,
  path,
  children,
  ...attrs
}: SpPowerProps) => {
  className ||= "";
  if (typeof path === "string") {
    path = [path];
  }
  return (
    <div className={`power ${className}`} {...attrs}>
      {path.map((p) => (
        <SpSpireImage className="power__image" path={p} key={p} />
      ))}
      {children && <SpItemLabel>{children}</SpItemLabel>}
    </div>
  );
};
