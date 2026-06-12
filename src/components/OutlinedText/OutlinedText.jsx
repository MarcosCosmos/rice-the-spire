const OutlinedText = ({ className, children }) => {
  className ||= '';
  return (
    <span className={`outlined-text ${className}`}>
      <span className="outlined-text__foreground">{children}</span>
      <span className="outlined-text__background" aria-hidden="true">{children}</span>
    </span>
  );
};

export default OutlinedText;
