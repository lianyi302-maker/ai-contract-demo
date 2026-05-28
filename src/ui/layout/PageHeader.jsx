import Button from '../primitives/Button';

/**
 * 页面标题区
 * @param {React.ReactNode} status - 状态标签（Badge 等）
 * @param {{ label: string, variant?: string, onClick?: () => void }[]} actions
 */
export default function PageHeader({
  title,
  description,
  status,
  actions = [],
  children,
  className = '',
}) {
  return (
    <header className={`ui-page-header ${className}`.trim()}>
      <div className="ui-page-header__row">
        <div>
          <h1 className="ui-page-header__title">{title}</h1>
          {description ? <p className="ui-page-header__desc">{description}</p> : null}
        </div>
        <div className="ui-page-header__meta">
          {status}
          {actions.length > 0 ? (
            <div className="ui-page-header__actions">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  type="button"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {children}
    </header>
  );
}
