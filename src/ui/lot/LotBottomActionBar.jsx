import Button from '../primitives/Button';

/**
 * 拍品清单底栏 — 汇总 + 全选 + 保存/提交
 */
export default function LotBottomActionBar({
  selectedCount = 0,
  reservePriceTotal = 0,
  summaryConfig,
  selectionActions = [],
  saveActions = [],
  autoSaveHint,
  onSelectionAction,
  onSaveAction,
  className = '',
}) {
  const countLabel = (summaryConfig?.selectedCountLabel || '已选 {count} 个拍品').replace(
    '{count}',
    String(selectedCount)
  );
  const amountLabel = (
    summaryConfig?.reservePriceTotalLabel || '保留价总额 RMB {amount}'
  ).replace('{amount}', reservePriceTotal.toLocaleString('zh-CN'));

  return (
    <footer className={`ui-lot-bottom-bar ${className}`.trim()}>
      <div className="ui-lot-bottom-bar__left">
        <span>{countLabel}</span>
        <span className="ui-lot-bottom-bar__total">{amountLabel}</span>
      </div>
      <div className="ui-lot-bottom-bar__center">
        {selectionActions.map((a) => (
          <Button
            key={a.key}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelectionAction?.(a.key)}
          >
            {a.label}
          </Button>
        ))}
      </div>
      <div className="ui-lot-bottom-bar__right">
        {autoSaveHint ? <span className="ui-lot-bottom-bar__hint">{autoSaveHint}</span> : null}
        {saveActions.map((a) => (
          <Button
            key={a.key}
            type="button"
            variant={a.variant || (a.primary ? 'primary' : 'default')}
            onClick={() => onSaveAction?.(a.key)}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </footer>
  );
}
