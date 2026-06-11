import { useId } from 'react';

const MenuButton = ({ className, children, disabled, ...attrs }) => {
  className ||= '';
  return (
    <button className={`menu-item ${className}`} role="menuitem" aria-disabled={disabled} tabIndex="0" {...attrs}>
      {children}
    </button>
  );
};

const Tooltip = ({ anchor, children }) => {
  const id = useId();
  return (
    <div className="tooltip-shrinkwrap">
      {anchor(id)}
      <div id={id} className="tooltip" role="tooltip">
        {children}
      </div>
    </div>
  );
};

const MenuItem = ({ children, tooltip, ...attrs }) => {
  const button = tooltipId => <MenuButton aria-describedby={tooltipId} {...attrs}>{children}</MenuButton>;
  return tooltip ? (
    <Tooltip anchor={button}>{tooltip}</Tooltip>
  ) : button();
};

export default MenuItem;
