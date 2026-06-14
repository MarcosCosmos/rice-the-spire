import SpSpireImage from "../SpSpireImage";
import "./SpCrossout.css";

const SpCrossout = ({ className }: { className?: string }) => {
  className ||= "";
  return (
    <SpSpireImage
      className={`crossout ${className}`}
      path="powers/well_laid_plans"
    />
  );
};
export default SpCrossout;
