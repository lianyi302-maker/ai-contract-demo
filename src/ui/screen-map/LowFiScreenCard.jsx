import { resolveMapNextScreens } from '../../data/screenMapScreens';

/**
 * 低保真页面地图卡片
 */
export default function LowFiScreenCard({ screen, style, className = '' }) {
  const nextList = resolveMapNextScreens(screen);
  const confirmPoints = screen.humanConfirmPoints || [];
  const exceptionPoints = screen.exceptions || [];

  return (
    <article
      className={`ui-lowfi-card ${className}`.trim()}
      style={style}
      aria-label={`${screen.id} ${screen.name}`}
    >
      {confirmPoints.length > 0 ? (
        <span className="ui-lowfi-card__pin ui-lowfi-card__pin--confirm" title={confirmPoints.join('；')}>
          人工确认 {confirmPoints.length}
        </span>
      ) : null}
      {exceptionPoints.length > 0 ? (
        <span className="ui-lowfi-card__pin ui-lowfi-card__pin--exception" title={exceptionPoints.join('；')}>
          异常检查 {exceptionPoints.length}
        </span>
      ) : null}
      <header className="ui-lowfi-card__head">
        <span className="ui-lowfi-card__id">{screen.id}</span>
        <h3 className="ui-lowfi-card__title">{screen.name}</h3>
      </header>

      <section className="ui-lowfi-card__block">
        <h4 className="ui-lowfi-card__label">页面目标</h4>
        <p className="ui-lowfi-card__text">{screen.goal}</p>
      </section>

      <section className="ui-lowfi-card__block">
        <h4 className="ui-lowfi-card__label">主要操作</h4>
        <ul className="ui-lowfi-card__list">
          {(screen.mainActions || []).slice(0, 4).map((action) => (
            <li key={action}>{action}</li>
          ))}
          {(screen.mainActions || []).length > 4 ? (
            <li className="ui-lowfi-card__more">…共 {screen.mainActions.length} 项</li>
          ) : null}
        </ul>
      </section>

      <section className="ui-lowfi-card__block">
        <h4 className="ui-lowfi-card__label">跳转去向</h4>
        <div className="ui-lowfi-card__tags">
          {nextList.length > 0 ? (
            nextList.map((n) => (
              <span key={n.id} className="ui-badge ui-badge--neutral">
                {n.id} {n.name}
              </span>
            ))
          ) : (
            <span className="ui-lowfi-card__text">—</span>
          )}
        </div>
      </section>

      {confirmPoints.length > 0 || exceptionPoints.length > 0 ? (
        <footer className="ui-lowfi-card__footer">
          {confirmPoints.length > 0 ? (
            <div className="ui-lowfi-card__points">
              <span className="ui-lowfi-card__chip-title">人工确认点</span>
              <ul className="ui-lowfi-card__point-list">
                {confirmPoints.slice(0, 2).map((p) => (
                  <li key={p} className="ui-lowfi-card__point ui-lowfi-card__point--confirm">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {exceptionPoints.length > 0 ? (
            <div className="ui-lowfi-card__points">
              <span className="ui-lowfi-card__chip-title ui-lowfi-card__chip-title--warn">异常检查点</span>
              <ul className="ui-lowfi-card__point-list">
                {exceptionPoints.slice(0, 2).map((e) => (
                  <li key={e} className="ui-lowfi-card__point ui-lowfi-card__point--exception">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
}
