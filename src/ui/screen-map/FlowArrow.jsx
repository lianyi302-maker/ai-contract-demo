/**
 * 页面跳转箭头（SVG 曲线）
 */
export default function FlowArrow({
  from,
  to,
  markerId = 'ui-flow-arrowhead',
  stroke = '#bfbfbf',
  strokeWidth = 1.5,
}) {
  const { x: x1, y: y1 } = from;
  const { x: x2, y: y2 } = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const bend = Math.min(40, dist * 0.15);
  const cx = mx + (dy / dist) * bend;
  const cy = my - (dx / dist) * bend;
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      markerEnd={`url(#${markerId})`}
      opacity={0.85}
    />
  );
}

/** 计算节点中心连线起止点（留出边距） */
export function computeArrowEndpoints(fromCenter, toCenter, pad = 52) {
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  const dist = Math.hypot(dx, dy) || 1;
  return {
    from: {
      x: fromCenter.x + (dx / dist) * pad,
      y: fromCenter.y + (dy / dist) * pad,
    },
    to: {
      x: toCenter.x - (dx / dist) * pad,
      y: toCenter.y - (dy / dist) * pad,
    },
  };
}
