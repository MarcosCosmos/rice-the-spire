import OutlinedText from "../OutlinedText";

const ItemLabel = ({ className, children }) => (
  <div className={`item-label ${className || ""}`}>
    <OutlinedText>{children}</OutlinedText>
  </div>
);

export default ItemLabel;
