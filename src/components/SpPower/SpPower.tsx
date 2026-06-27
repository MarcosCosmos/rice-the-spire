import SpSpireImage from "../SpSpireImage";
import SpItemLabel from "../SpItemLabel";
import "./SpPower.css";
import { useSizeForExpectedText } from "../../util/useSizeForExpectedText";
import type { ReactNode } from "react";
export interface SpPowerProps {
  className?: string;
  path: string | string[];
  expectedText?: { text: string; font: string };
  children?: ReactNode;
}

export const SpPower = ({
  className,
  path,
  children,
  expectedText,
  ...attrs
}: SpPowerProps) => {
  className ??= "";
  if (typeof path === "string") {
    path = [path];
  }
  const labelStyle = expectedText
    ? useSizeForExpectedText(
        expectedText.text,
        expectedText.font,
        "var(--text-stroke-width)",
      )
    : undefined;
  return (
    <div className={`power ${className}`} {...attrs}>
      {path.map((p) => (
        <SpSpireImage className="power__image" path={p} key={p} />
      ))}
      {children && <SpItemLabel style={labelStyle}>{children}</SpItemLabel>}
    </div>
  );
};
