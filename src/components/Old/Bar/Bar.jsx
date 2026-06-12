const Bar = ({ className, ariaLabel, children, ...attrs }) => {
  className ||= '';
  if (attrs['aria-label']) {
    attrs = {
      role: 'region',
      ...attrs,
    };
  }

  return (
    <div className={`bar ${className}`} {...attrs}>
      {children}
    </div>
  );
};

export default Bar;
