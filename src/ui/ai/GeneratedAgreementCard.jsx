import Button from '../primitives/Button';

/**
 * 补充协议草稿卡
 */
export default function GeneratedAgreementCard({
  title,
  parties,
  clause,
  generatedAt,
  onCopy,
  onDownload,
  className = '',
}) {
  return (
    <article className={`ui-agreement-card ${className}`.trim()}>
      <header className="ui-agreement-card__head">
        <h4 className="ui-agreement-card__title">{title}</h4>
        <div style={{ display: 'flex', gap: 6 }}>
          {onCopy ? (
            <Button size="sm" variant="ghost" type="button" onClick={onCopy}>
              复制
            </Button>
          ) : null}
          {onDownload ? (
            <Button size="sm" variant="primary" type="button" onClick={onDownload}>
              下载
            </Button>
          ) : null}
        </div>
      </header>
      <div className="ui-agreement-card__body">
        {parties ? <p style={{ margin: '0 0 8px' }}>{parties}</p> : null}
        {clause ? <div className="ui-agreement-card__clause">{clause}</div> : null}
        {generatedAt ? (
          <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--ui-text-muted)' }}>
            生成时间：{generatedAt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
