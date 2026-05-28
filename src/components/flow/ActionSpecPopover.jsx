import { getFlowSpecByActionId } from '../../flowSpec';

const RISK_LABEL = {
  normal: '常规',
  needConfirm: '需确认',
  risk: '风险',
  blocking: '阻断',
};

export default function ActionSpecPopover({ actionId, onClose }) {
  const spec = getFlowSpecByActionId(actionId);
  if (!spec) return null;

  return (
    <div className="flow-spec-popover" role="dialog" aria-label={`触点 ${actionId}`}>
      <header className="flow-spec-popover__head">
        <span className="flow-spec-popover__action-id">{spec.actionId}</span>
        <button type="button" className="flow-spec-popover__close" onClick={onClose} aria-label="关闭">
          ×
        </button>
      </header>
      <h3 className="flow-spec-popover__title">{spec.actionLabel}</h3>
      <p className="flow-spec-popover__route">
        {spec.fromPageId} {spec.fromPageName} → {spec.toPageId} {spec.toPageName}
      </p>
      <dl className="flow-spec-popover__meta">
        <div>
          <dt>跳转编号</dt>
          <dd>{spec.id}</dd>
        </div>
        <div>
          <dt>触点类型</dt>
          <dd>{spec.actionType}</dd>
        </div>
        <div>
          <dt>风险等级</dt>
          <dd>
            <span className={`flow-risk flow-risk--${spec.riskLevel}`}>
              {RISK_LABEL[spec.riskLevel] || spec.riskLevel}
            </span>
          </dd>
        </div>
        <div>
          <dt>触发条件</dt>
          <dd>{spec.condition}</dd>
        </div>
        <div>
          <dt>不可点击</dt>
          <dd>{spec.disabledCondition}</dd>
        </div>
        <div>
          <dt>系统反馈</dt>
          <dd>{spec.feedback}</dd>
        </div>
        <div>
          <dt>交互说明</dt>
          <dd>{spec.note}</dd>
        </div>
      </dl>
    </div>
  );
}
