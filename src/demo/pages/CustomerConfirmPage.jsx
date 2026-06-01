import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import {
  CUSTOMER_SOURCE_LABEL,
  CUSTOMER_TYPE_LABEL,
  CUSTOMER_STATUS_LABEL,
  computeCustomerStats,
} from '../utils/customerConfirmUtils';
import CustomerConfirmForm from '../components/CustomerConfirmForm';

export default function CustomerConfirmPage() {
  const navigate = useNavigate();
  const { state, saveCustomerChanges, confirmCustomer } = useDemoFlow();
  const customers = state.mockCustomers;
  const [selectedId, setSelectedId] = useState(customers[0]?.id);
  const [checkedIds, setCheckedIds] = useState(() => new Set());
  const [formActions, setFormActions] = useState(null);
  const selectAllRef = useRef(null);

  const stats = useMemo(() => computeCustomerStats(customers), [customers]);
  const selected = customers.find((c) => c.id === selectedId) || customers[0];

  const customerIds = useMemo(() => customers.map((c) => c.id).join(','), [customers]);

  useEffect(() => {
    setCheckedIds(new Set(customers.map((c) => c.id)));
  }, [customerIds, customers]);

  const allChecked = customers.length > 0 && customers.every((c) => checkedIds.has(c.id));
  const someChecked = customers.some((c) => checkedIds.has(c.id));
  const indeterminate = someChecked && !allChecked;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const toggleChecked = useCallback((customerId) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(customerId)) next.delete(customerId);
      else next.add(customerId);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setCheckedIds((prev) => {
      if (customers.every((c) => prev.has(c.id))) return new Set();
      return new Set(customers.map((c) => c.id));
    });
  }, [customers]);

  const handleSave = (customerId, patch) => {
    saveCustomerChanges(customerId, patch);
  };

  const handleConfirm = (customerId) => {
    confirmCustomer(customerId);
    navigate('/demo');
  };

  return (
    <div className="demo-page demo-page--customer-confirm">
      <PageHeader
        title="客户信息线上确认"
        description="AI 已识别以下客户信息，请逐条确认。确认完成后，系统将自动创建或更新客户，并同步至客户管理页面。"
        actions={[
          {
            label: '返回合同录入 AI 助手',
            onClick: () => navigate('/demo'),
          },
        ]}
      />

      <div className="customer-confirm-stats">
        <span>全部 {stats.total}</span>
        <span>待确认 {stats.pending}</span>
        <span>信息缺失 {stats.missing}</span>
        <span>已完成 {stats.done}</span>
      </div>

      {customers.length === 0 ? (
        <p className="customer-confirm-detail__empty">
          请先在工作台完成 AI 识别，系统将自动生成客户确认任务。
        </p>
      ) : (
        <>
          <div className="customer-confirm-layout">
            <aside className="customer-confirm-list customer-confirm-list--floating">
              <ul className="customer-confirm-list__items">
                {customers.map((customer) => {
                  const active = customer.id === selected?.id;
                  const checked = checkedIds.has(customer.id);
                  return (
                    <li key={customer.id} className="customer-confirm-list__row">
                      <label
                        className="customer-confirm-list__check"
                        aria-label={`选择 ${customer.name}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChecked(customer.id)}
                        />
                      </label>
                      <button
                        type="button"
                        className={`customer-confirm-list__item${active ? ' customer-confirm-list__item--active' : ''}`}
                        onClick={() => setSelectedId(customer.id)}
                      >
                        <strong>{customer.name}</strong>
                        <span className="customer-confirm-list__meta">
                          {CUSTOMER_TYPE_LABEL[customer.customerType]} ·{' '}
                          {CUSTOMER_SOURCE_LABEL[customer.source]} ·{' '}
                          {CUSTOMER_STATUS_LABEL[customer.status]}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <div className="customer-confirm-detail">
              <div className="customer-confirm-detail__body">
                {selected ? (
                  <CustomerConfirmForm
                    key={selected.id + selected.status}
                    customer={selected}
                    onSave={handleSave}
                    onConfirm={handleConfirm}
                    showFooter={false}
                    onActionsReady={setFormActions}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="customer-confirm-dock" aria-label="批量操作">
            <div className="customer-confirm-dock__inner">
              <div className="customer-confirm-dock__bar">
                <label className="customer-confirm-form__select-all">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleSelectAll}
                  />
                  全选
                  {someChecked ? (
                    <span className="customer-confirm-form__select-count">
                      已选 {checkedIds.size} 位
                    </span>
                  ) : null}
                </label>
                <div className="customer-confirm-form__footer-actions">
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => formActions?.handleSave?.()}
                    disabled={!formActions || formActions.disabled || formActions.isDone}
                  >
                    保存修改
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    data-flow-action="A-P10-001"
                    disabled={
                      !formActions ||
                      formActions.disabled ||
                      formActions.isDone ||
                      !formActions.isComplete
                    }
                    onClick={() => formActions?.handleConfirm?.()}
                  >
                    {formActions?.confirmLabel || '确认并创建客户'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
