import { Link } from 'react-router-dom';
import { screens, resolveNextScreens } from '../screens';

export default function InteractionDocView() {
  return (
    <>
      <header className="view-heading">
        <h1>Interaction Doc View</h1>
        <p>交互说明文档 — 由 screens.js 字段自动渲染，供评审与开发对齐</p>
      </header>

      <p className="doc-intro">
        共 {screens.length} 个页面。修改{' '}
        <code>src/screens.js</code> 后，本页、原型页与页面地图将同步更新。
      </p>

      {screens.map((screen) => {
        const nextList = resolveNextScreens(screen);
        return (
          <section key={screen.id} className="doc-screen" id={screen.id}>
            <header className="doc-screen-header">
              <h2>
                {screen.id} · {screen.name}
              </h2>
              <code>{screen.path}</code>
              <Link to={screen.path} className="doc-link">
                打开原型 →
              </Link>
            </header>

            <div className="doc-screen-body">
              <div className="doc-block doc-block-full">
                <h3>页面目标</h3>
                <p>{screen.goal}</p>
              </div>

              <div className="doc-block">
                <h3>主要操作</h3>
                <ul className="doc-tag-list">
                  {screen.mainActions.map((a) => (
                    <li key={a} className="doc-tag">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="doc-block">
                <h3>下一步页面</h3>
                <ul className="doc-tag-list">
                  {nextList.map((n) => (
                    <li key={n.id} className="doc-tag">
                      <Link to={n.path}>
                        {n.id} {n.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="doc-block">
                <h3>异常场景</h3>
                <ul className="doc-tag-list">
                  {screen.exceptions.map((e) => (
                    <li key={e} className="doc-tag doc-tag-warn">
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="doc-block">
                <h3>人工确认点</h3>
                <ul>
                  {screen.humanConfirmPoints.map((p) => (
                    <li key={p}>
                      <span className="doc-tag doc-tag-confirm" style={{ marginRight: 6 }}>
                        确认
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
