import SpIcon from "../SpIcon";
import "./SpPower.css";
import { useSizeForExpectedText } from "../../util/useSizeForExpectedText";
import type { ReactNode } from "react";
import SpOutlinedText from "../SpOutlinedText";
export interface SpPowerProps {
  className?: string;
  path: string | string[];
  expectedText?: string;
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
  const labelAttrs = expectedText
    ? useSizeForExpectedText(expectedText)
    : undefined;
  return (
    <div className={`sp-power ${className}`} {...attrs}>
      {children && (
        <SpOutlinedText className="sp-power__label" {...labelAttrs}>
          {children}
        </SpOutlinedText>
      )}
      <div className="sp-power__icon-set">
        {path.map((p) => (
          <SpIcon className="sp-power__icon" path={p} key={p} />
        ))}
      </div>
    </div>
  );
};
