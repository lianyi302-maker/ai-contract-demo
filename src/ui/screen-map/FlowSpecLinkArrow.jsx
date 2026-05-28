import FlowArrow, { computeArrowEndpoints } from './FlowArrow';

/**
 * 从触点锚点指向目标页面中心的标注箭头
 */
export default function FlowSpecLinkArrow({
  from,
  to,
  label,
  condition,
  markerId = 'flow-spec-arrowhead',
}) {
  const endpoints = computeArrowEndpoints(from, to, 28);
  const mx = (endpoints.from.x + endpoints.to.x) / 2;
  const my = (endpoints.from.y + endpoints.to.y) / 2;
  const title = condition ? `${label} · ${condition}` : label;

  return (
    <g className="flow-spec-link">
      <FlowArrow
        from={endpoints.from}
        to={endpoints.to}
        markerId={markerId}
        stroke="#8c8c8c"
        strokeWidth={1.5}
      />
      <title>{title}</title>
      {label ? (
        <>
          <rect
            x={mx - Math.min(90, label.length * 5)}
            y={my - 22}
            width={Math.min(180, label.length * 10 + 16)}
            height={condition ? 36 : 20}
            rx={4}
            fill="#fff"
            stroke="#d9d9d9"
          />
          <text
            x={mx}
            y={my - (condition ? 10 : 4)}
            textAnchor="middle"
            fontSize={11}
            fontWeight="600"
            fill="#262626"
          >
            {label.length > 14 ? `${label.slice(0, 13)}…` : label}
          </text>
          {condition ? (
            <text x={mx} y={my + 8} textAnchor="middle" fontSize={9} fill="#8c8c8c">
              {condition.length > 22 ? `${condition.slice(0, 21)}…` : condition}
            </text>
          ) : null}
        </>
      ) : null}
    </g>
  );
}
