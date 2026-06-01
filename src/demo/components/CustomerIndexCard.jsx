import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import {
  CUSTOMER_STATUS,
  CUSTOMER_TASK_STATUS,
  computeCustomerSummary,
} from '../../data/demoFlowState';
import { useDemoFlow } from '../../context/DemoFlowContext';
import ConfirmedCustomerList from './ConfirmedCustomerList';

function badgeMeta(taskStatus) {
  if (taskStatus === CUSTOMER_TASK_STATUS.COMPLETED) {
    return { label: '已完成', className: 'demo-result-index__badge--confirmed' };
  }
  if (taskStatus === CUSTOMER_TASK_STATUS.IN_PROGRESS) {
    return { label: '处理中', className: 'demo-result-index__badge--written' };
  }
  return { label: '待确认', className: 'demo-result-index__badge--pending' };
}

function summaryText(taskStatus, summary) {
  const {
    customerCount,
    customerPendingCount,
    customerMissingCount,
    customerCreatedCount,
    customerUpdatedCount,
  } = summary;
  if (taskStatus === CUSTOMER_TASK_STATUS.COMPLETED) {
    return `共识别 ${customerCount} 位客户 · 成功创建 ${customerCreatedCount} · 已更新 ${customerUpdatedCount} · 信息缺失 0`;
  }
  if (taskStatus === CUSTOMER_TASK_STATUS.IN_PROGRESS) {
    return `共识别 ${customerCount} 位客户 · 成功创建 ${customerCreatedCount + customerUpdatedCount} · 信息缺失 ${customerMissingCount}`;
  }
  return `共识别 ${customerCount} 位客户 · 待确认 ${customerPendingCount} · 信息缺失 ${customerMissingCount}`;
}

function buttonLabel(taskStatus) {
  if (taskStatus === CUSTOMER_TASK_STATUS.COMPLETED) return '查看结果';
  if (taskStatus === CUSTOMER_TASK_STATUS.IN_PROGRESS) return '继续确认';
  return '查看/确认客户';
}

export default function CustomerIndexCard() {
  const navigate = useNavigate();
  const { state } = useDemoFlow();
  const summary = useMemo(
    () => computeCustomerSummary(state.mockCustomers),
    [state.mockCustomers]
  );
  const taskStatus = state.customerTaskStatus;
  const badge = badgeMeta(taskStatus);
  const isCompleted = taskStatus === CUSTOMER_TASK_STATUS.COMPLETED;
  const hasConfirmed = useMemo(
    () =>
      state.mockCustomers.some((c) =>
        [CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(c.status)
      ),
    [state.mockCustomers]
  );

  if (!state.mockCustomers.length) return null;

  return (
    <div className="demo-result-index__card demo-result-index__card--wide demo-result-index__card--customer">
      <div className="demo-result-index__card-head">
        <strong className="demo-result-index__card-title">客户信息线上确认</strong>
        <span className={`demo-result-index__badge ${badge.className}`}>{badge.label}</span>
      </div>
      <div className="demo-result-index__card-body demo-result-index__card-body--customer">
        {hasConfirmed ? (
          <ConfirmedCustomerList customers={state.mockCustomers} />
        ) : null}
        <div className="demo-result-index__row">
          <div className="demo-result-index__customer-desc">
            <p className="demo-result-index__row-hint demo-result-index__row-hint--primary">
              AI 已从合同及上传证件中识别相关客户，请逐条确认后创建或更新。
            </p>
            <p className="demo-result-index__customer-summary">
              {summaryText(taskStatus, summary)}
            </p>
            {isCompleted ? (
              <p className="demo-result-index__customer-complete">
                客户信息已同步至客户管理页面，并关联当前合同草稿。
              </p>
            ) : null}
          </div>
          <div className="demo-result-index__row-actions">
            <Button
              variant={isCompleted ? 'ghost' : 'primary'}
              size="sm"
              type="button"
              data-flow-action="A-P10-002"
              onClick={() => navigate('/demo/customer-confirm')}
            >
              {buttonLabel(taskStatus)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
