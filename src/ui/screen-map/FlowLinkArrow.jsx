import FlowArrow, { computeArrowEndpoints } from './FlowArrow';

/**
 * 带跳转说明的连线箭头
 */
export default function FlowLinkArrow({
  fromCenter,
  toCenter,
  label,
  markerId = 'real-map-arrowhead',
  pad = 72,
}) {
  const endpoints = computeArrowEndpoints(fromCenter, toCenter, pad);
  const mx = (endpoints.from.x + endpoints.to.x) / 2;
  const my = (endpoints.from.y + endpoints.to.y) / 2;

  return (
    <g className="real-map-link">
      <FlowArrow
        from={endpoints.from}
        to={endpoints.to}
        markerId={markerId}
        stroke="#595959"
        strokeWidth={2}
      />
      {label ? (
        <>
          <rect
            x={mx - label.length * 5.5}
            y={my - 14}
            width={label.length * 11 + 16}
            height={22}
            rx={4}
            fill="#fff"
            stroke="#d9d9d9"
          />
          <text
            x={mx}
            y={my + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="#434343"
            fontFamily="system-ui, sans-serif"
          >
            {label}
          </text>
        </>
      ) : null}
    </g>
  );
}
