import FieldStatusTag from './FieldStatusTag';
import { CATALOG_FEE_TIERS } from '../../schemas/contractContentSchema';
import { FIELD_STATUS } from '../constants';

/**
 * 费用规则编辑器 — 支持 tiered 固定阶梯（不可增删场次）
 */
export default function FeeRuleEditor({
  label,
  mode = 'deal',
  feeRuleConfig,
  value = {},
  status = FIELD_STATUS.NORMAL,
  onChange,
  readOnly = false,
  className = '',
}) {
  const items = feeRuleConfig?.items ?? [];
  const tiers = feeRuleConfig?.catalogFeeTiers ?? CATALOG_FEE_TIERS;

  const updateItem = (itemKey, patch) => {
    if (!onChange) return;
    onChange({ ...value, [itemKey]: { ...(value[itemKey] || {}), ...patch } });
  };

  const updateTier = (itemKey, tierKey, amount) => {
    if (!onChange) return;
    const prev = value[itemKey]?.tiers || {};
    onChange({
      ...value,
      [itemKey]: {
        ...value[itemKey],
        tiers: { ...prev, [tierKey]: amount },
      },
    });
  };

  return (
    <div className={`ui-fee-rule ${className}`.trim()} data-mode={mode}>
      <div className="ui-fee-rule__head">
        <h4 className="ui-fee-rule__title">{label}</h4>
        <FieldStatusTag status={status} />
      </div>

      <div className="ui-fee-rule__body">
        {items.map((item) => {
          const itemValue = value[item.key] || {};
          if (item.tiered && item.tierKeys) {
            return (
              <div key={item.key} className="ui-fee-rule__group">
                <div className="ui-fee-rule__item-label">
                  {item.label}
                  {item.uncertain ? (
                    <span className="ui-badge ui-badge--neutral" style={{ marginLeft: 6 }}>
                      uncertain
                    </span>
                  ) : null}
                </div>
                <table className="ui-fee-rule__tier-table">
                  <thead>
                    <tr>
                      <th>拍卖会类型</th>
                      <th>金额/费率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers
                      .filter((t) => item.tierKeys.includes(t.key))
                      .map((tier) => (
                        <tr key={tier.key}>
                          <td>{tier.label}</td>
                          <td>
                            <input
                              className="ui-field__control"
                              style={{ width: 120 }}
                              value={itemValue.tiers?.[tier.key] ?? ''}
                              readOnly={readOnly}
                              placeholder={item.valueType === 'percent' ? '%' : '元'}
                              onChange={(e) => updateTier(item.key, tier.key, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            );
          }

          return (
            <div key={item.key} className="ui-fee-rule__row">
              <label className="ui-fee-rule__item-label">
                {item.label}
                {item.uncertain ? (
                  <span className="ui-badge ui-badge--neutral" style={{ marginLeft: 6 }}>
                    uncertain
                  </span>
                ) : null}
              </label>
              <input
                className="ui-field__control"
                style={{ width: 120 }}
                value={itemValue.value ?? ''}
                readOnly={readOnly}
                placeholder={item.valueType === 'percent' ? '%' : '元'}
                onChange={(e) => updateItem(item.key, { value: e.target.value })}
              />
              {itemValue.unit ? (
                <span className="ui-fee-rule__unit">{itemValue.unit}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
