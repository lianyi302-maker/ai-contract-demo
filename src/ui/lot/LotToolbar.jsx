import Button from '../primitives/Button';

/**
 * 清单级操作按钮区
 */
export default function LotToolbar({ actions = [], onAction, className = '' }) {
  return (
    <div className={`ui-lot-toolbar ${className}`.trim()}>
      {actions.map((action) => (
        <Button
          key={action.key}
          type="button"
          variant={action.primary ? 'primary' : 'default'}
          size="sm"
          onClick={() => onAction?.(action.key)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
