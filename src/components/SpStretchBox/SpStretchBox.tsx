/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { ReactNode } from "react";
import resolveSpireImage from "../../util/resolveSpireImage";
import "./SpStretchBox.css";

export interface SpStretchBoxProps {
  className?: string;
  path: string;
  height: number;
  width: number;
  inset: number;
  children: ReactNode;
}

export const SpStretchBox = ({
  className,
  path,
  height,
  width,
  inset,
  children,
}: SpStretchBoxProps) => {
  className ??= "";
  const backdropUrl = resolveSpireImage(path);
  const rightInset = width - inset;
  const midWidth = width - 2 * inset;
  const image = (
    <image href={backdropUrl} x="0" y="0" width={width} height={height} />
  );
  return (
    <div className={`stretch-box ${className}`}>
      <div className="stretch-box__background">
        <svg
          className="stretch-box__left-bookend"
          viewBox={`0 0 ${inset} ${height}`}
          aria-hidden="true"
        >
          {image}
        </svg>
        <svg
          className="stretch-box__center-background"
          viewBox={`${inset} 0 ${midWidth} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {image}
        </svg>
        <svg
          className="stretch-box__right-bookend"
          viewBox={`${rightInset} 0 ${inset} ${height}`}
          aria-hidden="true"
        >
          {image}
        </svg>
      </div>
      {children}
    </div>
  );
};
