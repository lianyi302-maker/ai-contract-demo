import { getLotAuditStatusDef } from '../../schemas/lotStatusSchema';

const COLOR_CLASS = {
  blue: 'ui-lot-audit--maintenance',
  orange: 'ui-lot-audit--pending',
  green: 'ui-lot-audit--approved',
  red: 'ui-lot-audit--rejected',
};

/**
 * 拍品业务审核状态标签
 */
export default function LotStatusTag({ statusKey, rejectReason, className = '' }) {
  const def = getLotAuditStatusDef(statusKey);
  if (!def) return <span className={className}>—</span>;
  const mod = COLOR_CLASS[def.color] || '';
  return (
    <span className={`ui-lot-audit ${mod} ${className}`.trim()} title={rejectReason}>
      {def.label}
      {rejectReason && def.showRejectReason ? (
        <span className="ui-lot-audit__reason"> · {rejectReason}</span>
      ) : null}
    </span>
  );
}
