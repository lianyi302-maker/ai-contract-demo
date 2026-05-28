import { contractContentSchema } from '../../schemas/contractContentSchema';
import { FIELD_TYPE } from '../../schemas/shared';
import { getDraftStatus, getDraftValue, getDraftHint } from '../../schemas/shared';
import FeeRuleEditor from './FeeRuleEditor';
import ClauseEditor from './ClauseEditor';
import EditableField from '../business/EditableField';
import { FIELD_STATUS } from '../constants';

/**
 * 渲染 contractContentSchema.blocks
 */
export default function ContractContentRenderer({
  draftContent = {},
  onBlockChange,
  onFieldChange,
  readOnly = false,
}) {
  return (
    <div className="ui-contract-content">
      {contractContentSchema.blocks.map((block) => {
        const blockDraft = draftContent[block.key] || {};
        const blockStatus = blockDraft.status || FIELD_STATUS.NORMAL;
        const blockValue = blockDraft.value ?? blockDraft;

        if (block.component === 'FeeRuleEditor') {
          return (
            <FeeRuleEditor
              key={block.key}
              label={block.label}
              mode={block.mode}
              feeRuleConfig={block.feeRuleConfig}
              value={typeof blockValue === 'object' ? blockValue : {}}
              status={blockStatus}
              readOnly={readOnly}
              onChange={
                onBlockChange
                  ? (val) => onBlockChange(block.key, val, FIELD_STATUS.MODIFIED)
                  : undefined
              }
            />
          );
        }

        if (block.component === 'ClauseEditor' || block.type === FIELD_TYPE.CLAUSE) {
          return (
            <ClauseEditor
              key={block.key}
              label={block.label}
              value={typeof blockValue === 'object' ? blockValue : { clauses: [] }}
              status={blockStatus}
              readOnly={readOnly}
              onClauseChange={
                onFieldChange
                  ? (clauseId, fieldKey, val) =>
                      onFieldChange('contractContent', block.key, clauseId, val)
                  : undefined
              }
            />
          );
        }

        if (block.component === 'DeclarationRadio' && block.fields) {
          const field = block.fields[0];
          const val = getDraftValue({ [field.key]: blockDraft[field.key] || blockDraft }, field.key);
          const st = getDraftStatus({ [field.key]: blockDraft[field.key] || blockDraft }, field.key) || blockStatus;
          return (
            <div key={block.key} className="ui-fee-rule">
              <h4 className="ui-fee-rule__title">{block.label}</h4>
              <div className="ui-gallery__row">
                {field.options?.map((opt) => (
                  <label key={opt.value} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      type="radio"
                      name={field.key}
                      value={opt.value}
                      checked={val === opt.value}
                      disabled={readOnly}
                      onChange={() =>
                        onFieldChange?.('contractContent', field.key, opt.value, FIELD_STATUS.MODIFIED)
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {field.uncertain ? (
                <span className="ui-badge ui-badge--neutral">uncertain</span>
              ) : null}
            </div>
          );
        }

        if (block.component === 'AuctionTypeSelector' || block.component === 'DateRange') {
          return (
            <div key={block.key} className="ui-section-card" style={{ marginBottom: 16 }}>
              <h4 className="ui-fee-rule__title">{block.label}</h4>
              <div className={block.component === 'DateRange' ? 'ui-contract-form__grid' : 'ui-gallery__row'}>
                {block.fields?.map((field) => {
                  const slice = blockDraft.fields || blockDraft;
                  const entry = slice[field.key] || blockDraft[field.key];
                  return (
                    <EditableField
                      key={field.key}
                      name={`${block.key}.${field.key}`}
                      label={field.label}
                      type={field.type}
                      value={entry?.value ?? entry ?? ''}
                      status={entry?.status || FIELD_STATUS.NORMAL}
                      hint={entry?.hint || (field.uncertain ? '字段待与系统核对 (uncertain)' : undefined)}
                      options={field.options}
                      readOnly={readOnly}
                      onChange={
                        onFieldChange
                          ? (v) => onFieldChange('contractContent', field.key, v, FIELD_STATUS.MODIFIED)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
