/**
 * AI 执行结果卡片
 * @param {'success'|'warning'|'error'} status
 */
export default function CommandResultCard({
  title,
  status = 'success',
  summary,
  changes = [],
  className = '',
}) {
  const badgeMod =
    status === 'success' ? 'success' : status === 'error' ? 'error' : 'low';
  const badgeLabel =
    status === 'success' ? '成功' : status === 'error' ? '失败' : '待确认';

  return (
    <article className={`ui-cmd-card ${className}`.trim()}>
      <h4 className="ui-cmd-card__title">
        {title}
        <span className={`ui-badge ui-badge--${badgeMod}`}>{badgeLabel}</span>
      </h4>
      {summary ? <p className="ui-cmd-card__summary">{summary}</p> : null}
      {changes.length > 0 ? (
        <ul className="ui-cmd-card__changes">
          {changes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
