import { getFlowSpecsByFromPage } from '../../flowSpec';

export default function FlowSpecPageCard({ page, selected, onSelect, onSelectAction }) {
  const actions = getFlowSpecsByFromPage(page.id);

  return (
    <article
      className={`flow-map-page-card ${selected ? 'flow-map-page-card--selected' : ''}`}
      style={{
        left: page.layoutX,
        top: page.layoutY,
        width: page.width,
      }}
      onClick={() => onSelect?.(page.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect?.(page.id);
      }}
    >
      <header className="flow-map-page-card__head">
        <span className="flow-map-page-card__id">{page.id}</span>
        <h3 className="flow-map-page-card__name">{page.name}</h3>
      </header>
      <ul className="flow-map-page-card__actions">
        {actions.map((a) => (
          <li key={a.actionId}>
            <button
              type="button"
              className="flow-map-page-card__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAction?.(a.actionId);
              }}
            >
              <code>{a.actionId}</code>
              <span>{a.actionLabel}</span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
