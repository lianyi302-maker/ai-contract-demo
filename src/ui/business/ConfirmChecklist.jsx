/**
 * 提交前人工确认清单
 * @param {{ id: string, label: string, required?: boolean, checked?: boolean }[]} items
 */
export default function ConfirmChecklist({
  items = [],
  onToggle,
  className = '',
}) {
  return (
    <ul className={`ui-checklist ${className}`.trim()} aria-label="人工确认清单">
      {items.map((item) => (
        <li
          key={item.id}
          className={[
            'ui-checklist__item',
            item.required && 'ui-checklist__item--required',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            type="checkbox"
            id={`check-${item.id}`}
            checked={Boolean(item.checked)}
            onChange={
              onToggle ? () => onToggle(item.id, !item.checked) : undefined
            }
            readOnly={!onToggle}
          />
          <label className="ui-checklist__label" htmlFor={`check-${item.id}`}>
            {item.label}
            {item.required ? <span className="ui-checklist__tag">*必填</span> : null}
          </label>
        </li>
      ))}
    </ul>
  );
}
