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

/**
 * Splices an image horizontally in 3 parts using cut points defined
 * Note: SpStretchBox is deliberately a black box that I advise against applyinglayout styles to
 * It should naturally shrink-wrap around its contents and you should try to manage styling  with boxes in and around it but not it's actual box(es)
 * @returns
 */
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
    <div className={`sp-stretch-box ${className}`}>
      <div className="sp-stretch-box__position-wrapper" aria-hidden="true">
        <div className="sp-stretch-box__background">
          <svg
            className="sp-stretch-box__left-bookend"
            viewBox={`0 0 ${inset} ${height}`}
          >
            {image}
          </svg>
          <svg
            className="sp-stretch-box__center-background"
            viewBox={`${inset} 0 ${midWidth} ${height}`}
            preserveAspectRatio="none"
          >
            {image}
          </svg>
          <svg
            className="sp-stretch-box__right-bookend"
            viewBox={`${rightInset} 0 ${inset} ${height}`}
          >
            {image}
          </svg>
        </div>
      </div>
      <div className="sp-stretch-box__anchor">{children}</div>
    </div>
  );
};
