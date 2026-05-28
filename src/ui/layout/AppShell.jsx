import { NavLink } from 'react-router-dom';

/**
 * 后台系统整体外壳
 * @param {string} brand - 主标题
 * @param {string} brandSub - 副标题
 * @param {{ to: string, label: string }[]} navItems - 顶栏导航
 * @param {React.ReactNode} headerExtra - 顶栏右侧扩展
 * @param {React.ReactNode} aside - 右侧边栏（如 AI 面板）
 * @param {React.ReactNode} footer - 底部 ActionBar 等
 */
export default function AppShell({
  brand = 'AI 合同录入助手',
  brandSub = 'Demo',
  navItems = [],
  headerExtra,
  aside,
  footer,
  children,
  className = '',
}) {
  const withAside = Boolean(aside);

  return (
    <div className={`ui-app-shell ${className}`.trim()}>
      <header className="ui-app-shell__header">
        <div className="ui-app-shell__header-inner">
          <div className="ui-app-shell__brand">
            {brand}
            {brandSub ? <span className="ui-app-shell__brand-sub">{brandSub}</span> : null}
          </div>
          {navItems.length > 0 ? (
            <nav className="ui-app-shell__nav" aria-label="主导航">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          ) : null}
          {headerExtra}
        </div>
      </header>

      <div className="ui-app-shell__body">
        <div
          className={
            withAside
              ? 'ui-app-shell__main ui-app-shell__main--with-sidebar'
              : 'ui-app-shell__main'
          }
        >
          <div className={withAside ? 'ui-app-shell__content' : undefined}>
            {children}
          </div>
          {aside ? <aside className="ui-app-shell__aside">{aside}</aside> : null}
        </div>
        {footer}
      </div>
    </div>
  );
}
