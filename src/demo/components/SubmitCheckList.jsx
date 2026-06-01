export default function SubmitCheckList({ items = [], allPass = false, compact = false }) {
  return (
    <div className={`demo-submit-check${compact ? ' demo-submit-check--compact' : ''}`}>
      <ul className="demo-submit-check__list">
        {items.map((item) => (
          <li key={item.id} className="demo-submit-check__item">
            <span
              className={`ui-badge ${item.pass ? 'ui-badge--success' : 'ui-badge--error'}`}
            >
              {item.pass ? '通过' : '未通过'}
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <p className={`demo-submit-check__summary ${allPass ? 'demo-submit-check__summary--ok' : ''}`}>
        {allPass ? '可以提交审核' : '需处理后提交'}
      </p>
    </div>
  );
}
