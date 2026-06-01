import { useState } from 'react';
import { Button } from '../../ui';
import { CUSTOMER_STATUS } from '../../data/demoFlowState';

const VISIBLE_LIMIT = 5;

export default function ConfirmedCustomerList({ customers = [] }) {
  const [expanded, setExpanded] = useState(false);

  const confirmed = customers.filter((c) =>
    [CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(c.status)
  );

  if (!confirmed.length) return null;

  const hasMore = confirmed.length > VISIBLE_LIMIT;
  const visible = expanded || !hasMore ? confirmed : confirmed.slice(0, VISIBLE_LIMIT);
  const hiddenCount = confirmed.length - VISIBLE_LIMIT;

  return (
    <div className="confirmed-customer-list">
      <p className="confirmed-customer-list__title">已确认客户</p>
      <ul className="confirmed-customer-list__items">
        {visible.map((customer) => (
          <li key={customer.id} className="confirmed-customer-list__item">
            <span className="confirmed-customer-list__name">{customer.name}</span>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="confirmed-customer-list__detail-btn"
              onClick={() => window.alert(`[Demo] 查看 ${customer.name} 详情`)}
            >
              查看详情
            </Button>
          </li>
        ))}
      </ul>
      {hasMore && !expanded ? (
        <button
          type="button"
          className="confirmed-customer-list__toggle"
          onClick={() => setExpanded(true)}
        >
          展开其余 {hiddenCount} 位
        </button>
      ) : null}
      {hasMore && expanded ? (
        <button
          type="button"
          className="confirmed-customer-list__toggle"
          onClick={() => setExpanded(false)}
        >
          收起
        </button>
      ) : null}
    </div>
  );
}
