import { OutlinedText } from '../';

const ItemLabel = ({ className, children }) => (
  <div className={`item-label ${className || ''}`}>
    <OutlinedText>{children}</OutlinedText>
  </div>
);

export default ItemLabel;
