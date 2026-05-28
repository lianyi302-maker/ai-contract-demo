/**
 * 更新系统草稿前的差异预览
 * @param {{ field: string, before: string, after: string }[]} items
 */
export default function DiffPreview({ title = '变更预览', items = [], className = '' }) {
  if (!items.length) {
    return (
      <div className={`ui-diff ${className}`.trim()}>
        <div className="ui-diff__header">{title}</div>
        <p style={{ padding: 16, margin: 0, color: 'var(--ui-text-muted)', fontSize: 13 }}>
          暂无变更
        </p>
      </div>
    );
  }

  return (
    <div className={`ui-diff ${className}`.trim()}>
      <div className="ui-diff__header">{title}</div>
      {items.map((item) => (
        <div key={item.field} className="ui-diff__row">
          <span className="ui-diff__field">{item.field}</span>
          <span className="ui-diff__before">{item.before || '—'}</span>
          <span className="ui-diff__arrow" aria-hidden>
            →
          </span>
          <span className="ui-diff__after">{item.after || '—'}</span>
        </div>
      ))}
    </div>
  );
}
