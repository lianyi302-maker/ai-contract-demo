import Button from '../primitives/Button';

/**
 * 底部操作区
 * @param {{ label: string, variant?: string, onClick?: () => void, disabled?: boolean }[]} actions
 */
export default function ActionBar({ hint, actions = [], children, className = '' }) {
  return (
    <footer className={`ui-action-bar ${className}`.trim()}>
      <div className="ui-action-bar__hint">{hint || children}</div>
      {actions.length > 0 ? (
        <div className="ui-action-bar__actions">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              disabled={action.disabled}
              type="button"
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </footer>
  );
}
