import SpOutlinedText from "../SpOutlinedText";

const SpItemLabel = ({ className, children }) => (
  <div className={`item-label ${className || ""}`}>
    <SpOutlinedText>{children}</SpOutlinedText>
  </div>
);

export default SpItemLabel;
