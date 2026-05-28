/**
 * 分区卡片 — 包裹每个 schema section
 */
export default function SectionCard({
  title,
  extra,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
}) {
  return (
    <section className={`ui-section-card ${className}`.trim()}>
      <header className="ui-section-card__header">
        <h3 className="ui-section-card__title">{title}</h3>
        {extra ? <div className="ui-section-card__extra">{extra}</div> : null}
      </header>
      <div className="ui-section-card__body">{children}</div>
    </section>
  );
}
