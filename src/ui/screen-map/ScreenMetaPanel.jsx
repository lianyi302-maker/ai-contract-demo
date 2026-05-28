/**
 * 页面目标、操作、异常说明
 */
export default function ScreenMetaPanel({
  id,
  name,
  goal,
  mainActions = [],
  exceptions = [],
  humanConfirmPoints = [],
  className = '',
  style,
}) {
  if (!id && !name) {
    return (
      <aside className={`ui-screen-meta ${className}`.trim()} style={style}>
        <p style={{ margin: 0, color: 'var(--ui-text-muted)', fontSize: 13 }}>
          点击画布中的页面卡片查看元信息
        </p>
      </aside>
    );
  }

  return (
    <aside className={`ui-screen-meta ${className}`.trim()} style={style}>
      <h3 className="ui-screen-meta__title">{name}</h3>
      <div className="ui-screen-meta__id">{id}</div>

      {goal ? (
        <div className="ui-screen-meta__block">
          <h4>页面目标</h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ui-text-secondary)' }}>{goal}</p>
        </div>
      ) : null}

      {mainActions.length > 0 ? (
        <div className="ui-screen-meta__block">
          <h4>主要操作</h4>
          <ul>
            {mainActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {exceptions.length > 0 ? (
        <div className="ui-screen-meta__block">
          <h4>异常状态</h4>
          <ul className="ui-screen-meta__exceptions">
            {exceptions.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {humanConfirmPoints.length > 0 ? (
        <div className="ui-screen-meta__block">
          <h4>人工确认点</h4>
          <ul>
            {humanConfirmPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
