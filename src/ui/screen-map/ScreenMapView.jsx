import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import ScreenFrame from './ScreenFrame';
import FlowArrow, { computeArrowEndpoints } from './FlowArrow';
import ScreenMetaPanel from './ScreenMetaPanel';
import ExportToolbar from './ExportToolbar';
import {
  DEFAULT_NODE_LAYOUT,
  getNodeCenter,
  buildFlowEdges,
} from './screenMapLayout';

const MARKER_ID = 'ui-flow-arrowhead';

/**
 * 页面地图画布（可复用）
 */
export default function ScreenMapView({
  screens = [],
  layout = DEFAULT_NODE_LAYOUT,
  selectedId,
  onSelectScreen,
  showMeta = true,
  showExport = true,
  title,
  description,
  className = '',
}) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 1000, h: 400 });
  const [exporting, setExporting] = useState(false);

  const edges = useMemo(() => buildFlowEdges(screens), [screens]);
  const selected = screens.find((s) => s.id === selectedId);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  const handleExportPng = useCallback(() => {
    setExporting(true);
    window.alert('原型演示：PNG 导出将在接入 html2canvas 后实现');
    setExporting(false);
  }, []);

  const handlePrintPdf = useCallback(() => {
    setExporting(true);
    window.print();
    setTimeout(() => setExporting(false), 300);
  }, []);

  return (
    <div className={`ui-screen-map ${className}`.trim()}>
      {(title || description || showExport) && (
        <div className="ui-screen-map__toolbar-row">
          <div>
            {title ? <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>{title}</h2> : null}
            {description ? (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ui-text-secondary)' }}>
                {description}
              </p>
            ) : null}
          </div>
          {showExport ? (
            <ExportToolbar
              exporting={exporting}
              onExportPng={handleExportPng}
              onPrintPdf={handlePrintPdf}
            />
          ) : null}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div className="ui-screen-map__canvas-wrap" style={{ flex: 1 }}>
          <div className="ui-screen-map__canvas" ref={canvasRef}>
            <svg
              className="ui-screen-map__svg"
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`}
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
                  <path d="M0,0 L8,4 L0,8 Z" fill="#bfbfbf" />
                </marker>
              </defs>
              {edges.map(({ from, to }) => {
                const endpoints = computeArrowEndpoints(
                  getNodeCenter(from, layout),
                  getNodeCenter(to, layout)
                );
                return (
                  <FlowArrow
                    key={`${from}-${to}`}
                    from={endpoints.from}
                    to={endpoints.to}
                    markerId={MARKER_ID}
                  />
                );
              })}
            </svg>

            {screens.map((screen) => {
              const pos = layout[screen.id] || { x: 0, y: 0 };
              return (
                <ScreenFrame
                  key={screen.id}
                  id={screen.id}
                  name={screen.name}
                  path={screen.path}
                  href={onSelectScreen ? undefined : screen.path}
                  selected={screen.id === selectedId}
                  style={{ left: pos.x, top: pos.y }}
                  onClick={
                    onSelectScreen ? () => onSelectScreen(screen.id) : undefined
                  }
                  asLink={!onSelectScreen}
                />
              );
            })}
          </div>
        </div>

        {showMeta ? (
          <ScreenMetaPanel
            id={selected?.id}
            name={selected?.name}
            goal={selected?.goal}
            mainActions={selected?.mainActions}
            exceptions={selected?.exceptions}
            humanConfirmPoints={selected?.humanConfirmPoints}
            style={{ width: 280, flexShrink: 0 }}
          />
        ) : null}
      </div>
    </div>
  );
}
