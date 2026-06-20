import SpSpireImage from "../SpSpireImage";
import SpItemLabel from "../SpItemLabel";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import "./SpPower.css";
import { measureTextWidth } from "../../util/measureText";
export interface SpPowerProps {
  className?: string;
  path: string | string[];
  // used by @chenglou/pretext to precompute expected (max) width for the label text, since this may be variable and we don't want stuff to move around.s
  assumedText?: { text: string; font: string };
  children?: ReactNode;
}

export const SpPower = ({
  className,
  path,
  children,
  assumedText,
  ...attrs
}: SpPowerProps) => {
  const [preWidth, setPreWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    setPreWidth(
      assumedText
        ? measureTextWidth(assumedText.text, assumedText.font)
        : undefined,
    );
  }, [assumedText]);
  className ??= "";
  if (typeof path === "string") {
    path = [path];
  }
  const style: CSSProperties = {
    minWidth: preWidth,
  };
  return (
    <div className={`power ${className}`} {...attrs}>
      {path.map((p) => (
        <SpSpireImage className="power__image" path={p} key={p} />
      ))}
      {children && <SpItemLabel style={style}>{children}</SpItemLabel>}
    </div>
  );
};
