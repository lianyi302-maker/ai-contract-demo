import { FIELD_STATUS, FIELD_STATUS_LABEL } from '../constants';

const BADGE_MOD = {
  [FIELD_STATUS.MISSING]: 'missing',
  [FIELD_STATUS.LOW_CONFIDENCE]: 'low',
  [FIELD_STATUS.CONFLICT]: 'error',
  [FIELD_STATUS.MODIFIED]: 'neutral',
  [FIELD_STATUS.SYSTEM_GENERATED]: 'neutral',
  [FIELD_STATUS.MUST_CONFIRM]: 'missing',
  error: 'error',
};

/**
 * 字段状态标签 — 展示 draftData.status
 */
export default function FieldStatusTag({ status, className = '' }) {
  if (!status || status === FIELD_STATUS.NORMAL) return null;
  const label = FIELD_STATUS_LABEL[status] || (status === 'error' ? '异常' : status);
  const mod = BADGE_MOD[status] || 'neutral';
  return (
    <span className={`ui-badge ui-badge--${mod} ${className}`.trim()} title={label}>
      {label}
    </span>
  );
}
