/**
 * 缺失项与异常项检查结果
 * @param {{ id: string, label: string, scope?: string, detail?: string }[]} missing
 * @param {{ id: string, label: string, scope?: string, detail?: string }[]} errors
 */
export default function AiCheckResult({
  missing = [],
  errors = [],
  className = '',
}) {
  return (
    <div className={`ui-ai-check ${className}`.trim()}>
      <section>
        <h4 className="ui-ai-check__section-title">
          缺失项
          <span className="ui-badge ui-badge--missing">{missing.length}</span>
        </h4>
        {missing.length === 0 ? (
          <p className="ui-field__hint" style={{ margin: 0 }}>
            无缺失项
          </p>
        ) : (
          <ul className="ui-ai-check__list ui-ai-check__list--missing">
            {missing.map((item) => (
              <li key={item.id} className="ui-ai-check__list-item">
                <span>
                  <strong>{item.label}</strong>
                  {item.scope ? ` · ${item.scope}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h4 className="ui-ai-check__section-title">
          异常项
          <span className="ui-badge ui-badge--error">{errors.length}</span>
        </h4>
        {errors.length === 0 ? (
          <p className="ui-field__hint" style={{ margin: 0 }}>
            无异常项
          </p>
        ) : (
          <ul className="ui-ai-check__list ui-ai-check__list--error">
            {errors.map((item) => (
              <li key={item.id} className="ui-ai-check__list-item">
                <span>
                  <strong>{item.label}</strong>
                  {item.scope ? ` · ${item.scope}` : ''}
                </span>
                {item.detail ? (
                  <span style={{ color: 'var(--ui-danger)', fontSize: 12 }}>{item.detail}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
