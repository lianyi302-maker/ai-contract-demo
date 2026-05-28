import { FIELD_TYPE } from '../../schemas/shared';
import { FIELD_STATUS } from '../constants';
import FieldStatusTag from '../schema/FieldStatusTag';

/**
 * 可编辑字段 — 由 schema type 驱动控件
 */
export default function EditableField({
  label,
  value = '',
  status = FIELD_STATUS.NORMAL,
  hint,
  readOnly = false,
  placeholder,
  required = false,
  onChange,
  name,
  type = FIELD_TYPE.TEXT,
  options = [],
  className = '',
}) {
  const statusKey = status === 'error' ? FIELD_STATUS.CONFLICT : status;
  const statusClass =
    statusKey && statusKey !== FIELD_STATUS.NORMAL ? `ui-field--${statusKey}` : '';

  const controlId = name || label;

  const renderControl = () => {
    if (type === FIELD_TYPE.SELECT) {
      return (
        <select
          id={controlId}
          name={name}
          className="ui-field__control"
          value={value}
          disabled={readOnly}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        >
          <option value="">请选择</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === FIELD_TYPE.DATE) {
      return (
        <input
          id={controlId}
          name={name}
          type="date"
          className="ui-field__control"
          value={value}
          readOnly={readOnly}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      );
    }

    if (type === FIELD_TYPE.TEXTAREA) {
      return (
        <textarea
          id={controlId}
          name={name}
          className="ui-field__control"
          rows={3}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      );
    }

    if (type === FIELD_TYPE.ADDRESS) {
      return (
        <div className="ui-field__address">
          <input
            className="ui-field__control"
            placeholder="省市区"
            readOnly={readOnly}
            style={{ marginBottom: 6 }}
          />
          <input
            id={controlId}
            name={name}
            className="ui-field__control"
            value={value}
            readOnly={readOnly}
            placeholder="详细地址"
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          />
        </div>
      );
    }

    return (
      <input
        id={controlId}
        name={name}
        className="ui-field__control"
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        aria-invalid={statusKey === FIELD_STATUS.CONFLICT}
      />
    );
  };

  if (className.includes('ui-field--hidden-control')) {
    return null;
  }

  return (
    <div className={`ui-field ${statusClass} ${className}`.trim()}>
      <div className="ui-field__label-row">
        <label className="ui-field__label" htmlFor={controlId}>
          {label}
          {required ? <span className="ui-field__required">*</span> : null}
        </label>
        <FieldStatusTag status={statusKey} />
      </div>
      {renderControl()}
      {hint ? <p className="ui-field__hint">{hint}</p> : null}
    </div>
  );
}
