import { Link } from 'react-router-dom';
import { resolveNextScreens } from '../screens';

/**
 * 低保真页面壳 — 后续可逐页替换为精修 UI，保留 props.screen 结构即可
 */
export default function PrototypeScreen({ screen }) {
  const nextList = resolveNextScreens(screen);

  return (
    <article className="proto-page" data-screen-id={screen.id}>
      <header className="proto-page-header">
        <div>
          <div className="proto-page-id">{screen.id}</div>
          <h1 className="proto-page-title">{screen.name}</h1>
        </div>
        <span className="proto-badge">低保真 · 待替换 UI</span>
      </header>

      <section className="proto-section">
        <div className="proto-section-label">页面目标</div>
        <p className="proto-goal">{screen.goal}</p>
      </section>

      <section className="proto-section">
        <div className="proto-section-label">主要操作</div>
        <div className="proto-actions">
          {screen.mainActions.map((action) => (
            <button key={action} type="button" className="btn btn-ghost" disabled>
              {action}
            </button>
          ))}
        </div>
      </section>

      <section className="proto-section">
        <div className="proto-section-label">异常提示</div>
        <ul className="proto-exceptions">
          {screen.exceptions.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      </section>

      <section className="proto-section">
        <div className="proto-section-label">人工确认点</div>
        <ul className="proto-confirm-list">
          {screen.humanConfirmPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="proto-section">
        <div className="proto-section-label">下一步</div>
        <div className="proto-next">
          {nextList.map((next) => (
            <Link key={next.id} to={next.path} className="btn btn-primary">
              → {next.id} {next.name}
            </Link>
          ))}
        </div>
      </section>

      <p className="proto-sidebar-hint">
        本页为交互原型占位，提供截图后可替换 <code>{screen.id}</code> 对应组件
      </p>
    </article>
  );
}
