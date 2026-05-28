import FieldStatusTag from './FieldStatusTag';
import { FIELD_STATUS } from '../constants';

/**
 * 特别约定 — 条款列表 + 行内占位输入
 * @param {{ clauses: Array<{ id, text, inlineFields? }> }} value
 */
export default function ClauseEditor({
  label = '特别约定',
  value = { clauses: [] },
  status = FIELD_STATUS.NORMAL,
  onClauseChange,
  readOnly = false,
  className = '',
}) {
  const clauses = value?.clauses ?? [];

  return (
    <div className={`ui-clause-editor ${className}`.trim()}>
      <div className="ui-clause-editor__head">
        <span className="ui-clause-editor__label">{label}</span>
        <FieldStatusTag status={status} />
      </div>
      {clauses.length === 0 ? (
        <p className="ui-field__hint">暂无条款</p>
      ) : (
        <ol className="ui-clause-editor__list">
          {clauses.map((clause, index) => (
            <li key={clause.id || index} className="ui-clause-editor__item">
              <div className="ui-clause-editor__text">{clause.text}</div>
              {clause.inlineFields?.map((field) => (
                <span key={field.key} className="ui-clause-editor__inline">
                  <input
                    className="ui-field__control"
                    style={{ width: 80, display: 'inline-block' }}
                    value={field.value ?? ''}
                    readOnly={readOnly}
                    onChange={
                      onClauseChange
                        ? (e) => onClauseChange(clause.id, field.key, e.target.value)
                        : undefined
                    }
                    aria-label={field.label}
                  />
                </span>
              ))}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
