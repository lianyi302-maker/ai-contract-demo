export default function Button({
  children,
  variant = 'default',
  size,
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = [
    'ui-btn',
    variant === 'primary' && 'ui-btn--primary',
    variant === 'ghost' && 'ui-btn--ghost',
    variant === 'danger' && 'ui-btn--danger',
    size === 'sm' && 'ui-btn--sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
