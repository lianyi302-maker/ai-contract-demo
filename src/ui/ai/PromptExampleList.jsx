/**
 * 自然语言指令示例
 */
export default function PromptExampleList({
  title = '指令示例',
  examples = [],
  onSelect,
  className = '',
}) {
  return (
    <div className={className}>
      {title ? (
        <h4 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--ui-text-secondary)' }}>
          {title}
        </h4>
      ) : null}
      <div className="ui-prompt-list" role="list">
        {examples.map((text) => (
          <button
            key={text}
            type="button"
            className="ui-prompt-list__item"
            onClick={onSelect ? () => onSelect(text) : undefined}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
