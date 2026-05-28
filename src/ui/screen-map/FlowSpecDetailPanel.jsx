import { getFlowPageById, getFlowSpecByActionId, getFlowSpecsByFromPage } from '../../flowSpec';

const RISK_LABEL = {
  normal: '常规',
  needConfirm: '需确认',
  risk: '风险',
  blocking: '阻断',
};

export default function FlowSpecDetailPanel({ selectedPageId, selectedActionId }) {
  const spec = selectedActionId ? getFlowSpecByActionId(selectedActionId) : null;
  const page = selectedPageId ? getFlowPageById(selectedPageId) : null;
  const pageActions = page ? getFlowSpecsByFromPage(page.id) : [];

  if (!spec && !page) {
    return (
      <aside className="flow-map-detail">
        <p className="flow-map-detail__empty">选择页面卡片或触点查看 flowSpec 详情</p>
      </aside>
    );
  }

  if (spec) {
    return (
      <aside className="flow-map-detail">
        <header className="flow-map-detail__head">
          <span className="flow-map-detail__tag">{spec.id}</span>
          <h2>{spec.actionLabel}</h2>
          <code className="flow-map-detail__code">{spec.actionId}</code>
        </header>
        <p className="flow-map-detail__route">
          {spec.fromPageId} → {spec.toPageId}
        </p>
        <dl className="flow-map-detail__dl">
          <div>
            <dt>来源页面</dt>
            <dd>
              {spec.fromPageId} {spec.fromPageName}
            </dd>
          </div>
          <div>
            <dt>目标页面</dt>
            <dd>
              {spec.toPageId} {spec.toPageName}
            </dd>
          </div>
          <div>
            <dt>触点类型</dt>
            <dd>{spec.actionType}</dd>
          </div>
          <div>
            <dt>风险等级</dt>
            <dd>
              <span className={`flow-risk flow-risk--${spec.riskLevel}`}>
                {RISK_LABEL[spec.riskLevel]}
              </span>
            </dd>
          </div>
          <div>
            <dt>触发条件</dt>
            <dd>{spec.condition}</dd>
          </div>
          <div>
            <dt>不可点击条件</dt>
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
      </aside>
    );
  }

  return (
    <aside className="flow-map-detail">
      <header className="flow-map-detail__head">
        <span className="flow-map-detail__tag">{page.id}</span>
        <h2>{page.name}</h2>
      </header>
      <p className="flow-map-detail__summary">{page.summary}</p>
      <p className="flow-map-detail__demo">
        Demo：<code>{page.demoPath}</code>
      </p>
      <h3 className="flow-map-detail__sub">本页触点（{pageActions.length}）</h3>
      <ul className="flow-map-detail__action-list">
        {pageActions.map((a) => (
          <li key={a.actionId}>
            <strong>{a.actionId}</strong> {a.actionLabel} → {a.toPageId}
          </li>
        ))}
      </ul>
    </aside>
  );
}
