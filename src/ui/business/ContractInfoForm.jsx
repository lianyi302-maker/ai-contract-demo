import EditableField from './EditableField';
import { FIELD_STATUS } from '../constants';

/**
 * 主合同字段确认表单
 * @param {{ key: string, label: string, value?: string, status?: string, hint?: string }[]} fields
 */
export default function ContractInfoForm({
  fields = [],
  onFieldChange,
  readOnly = false,
  title = '主合同信息',
  className = '',
}) {
  return (
    <section className={`ui-contract-form ${className}`.trim()} aria-labelledby="contract-form-title">
      {title ? (
        <h3 id="contract-form-title" style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>
          {title}
        </h3>
      ) : null}
      <div className="ui-contract-form__grid">
        {fields.map((field) => (
          <EditableField
            key={field.key}
            name={field.key}
            label={field.label}
            value={field.value ?? ''}
            status={field.status || FIELD_STATUS.NORMAL}
            hint={field.hint}
            readOnly={readOnly}
            onChange={
              onFieldChange ? (value) => onFieldChange(field.key, value) : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
