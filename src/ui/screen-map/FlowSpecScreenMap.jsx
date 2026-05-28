import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { flowSpec, flowPages } from '../../flowSpec';
import {
  FLOW_MAP_LAYOUT,
  FLOW_MAP_CANVAS,
  FLOW_MAP_PAGE_WIDTH,
  FLOW_MAP_PAGE_HEIGHT,
  getFlowMapPageCenter,
  getActionAnchor,
} from '../../flowSpec/flowMapLayout';
import FlowSpecPageCard from './FlowSpecPageCard';
import FlowSpecLinkArrow from './FlowSpecLinkArrow';
import FlowSpecDetailPanel from './FlowSpecDetailPanel';
import { Button } from '../index';

const MARKER_ID = 'flow-spec-arrowhead';

export default function FlowSpecScreenMap() {
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);

  const pageCards = useMemo(
    () =>
      flowPages.map((p) => ({
        ...p,
        layoutX: FLOW_MAP_LAYOUT[p.id]?.x ?? 0,
        layoutY: FLOW_MAP_LAYOUT[p.id]?.y ?? 0,
        width: FLOW_MAP_PAGE_WIDTH,
      })),
    []
  );

  const arrows = useMemo(() => {
    const byPage = {};
    flowPages.forEach((p) => {
      byPage[p.id] = flowSpec.filter((t) => t.fromPageId === p.id);
    });

    return flowSpec.map((t) => {
      const actionsOnPage = byPage[t.fromPageId] || [];
      const actionIndex = actionsOnPage.findIndex((a) => a.actionId === t.actionId);
      const from = getActionAnchor(t.fromPageId, actionIndex, actionsOnPage.length);
      const to = getFlowMapPageCenter(t.toPageId);
      return { spec: t, from, to };
    });
  }, []);

  return (
    <div className="flow-spec-map">
      <header className="flow-spec-map__header">
        <div>
          <h1 className="flow-spec-map__title">Screen Map · Flow Spec</h1>
          <p className="flow-spec-map__desc">
            页面卡片 + 触点列表 + 箭头（数据来自 flowSpec.js，无页面截图）
          </p>
        </div>
        <div className="flow-spec-map__header-actions">
          <Link to="/design-export">
            <Button type="button" variant="default">
              Design Export
            </Button>
          </Link>
          <Link to="/prototype">
            <Button type="button" variant="primary">
              Prototype View
            </Button>
          </Link>
        </div>
      </header>

      <div className="flow-spec-map__body">
        <div className="flow-spec-map__canvas-wrap">
          <div
            className="flow-spec-map__canvas"
            style={{
              width: FLOW_MAP_CANVAS.width,
              height: FLOW_MAP_CANVAS.height,
            }}
          >
            <svg
              className="flow-spec-map__svg"
              width={FLOW_MAP_CANVAS.width}
              height={FLOW_MAP_CANVAS.height}
              aria-hidden
            >
              <defs>
                <marker
                  id={MARKER_ID}
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 Z" fill="#8c8c8c" />
                </marker>
              </defs>
              {arrows.map(({ spec, from, to }) => (
                <FlowSpecLinkArrow
                  key={spec.id}
                  from={from}
                  to={to}
                  label={spec.actionLabel}
                  condition={spec.condition}
                  markerId={MARKER_ID}
                />
              ))}
            </svg>

            {pageCards.map((page) => (
              <FlowSpecPageCard
                key={page.id}
                page={page}
                selected={selectedPageId === page.id}
                onSelect={(id) => {
                  setSelectedPageId(id);
                  setSelectedActionId(null);
                }}
                onSelectAction={(actionId) => {
                  setSelectedActionId(actionId);
                  const spec = flowSpec.find((t) => t.actionId === actionId);
                  if (spec) setSelectedPageId(spec.fromPageId);
                }}
              />
            ))}
          </div>
        </div>

        <FlowSpecDetailPanel
          selectedPageId={selectedPageId}
          selectedActionId={selectedActionId}
        />
      </div>
    </div>
  );
}
