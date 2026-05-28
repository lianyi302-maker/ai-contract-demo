import { useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  REAL_MAP_CANVAS,
  realMapNodes,
  realMapLinks,
  getRealMapNodeById,
  getNodeCenter,
} from '../data/realFlowMapModel';
import RealPageFrame from '../ui/screen-map/RealPageFrame';
import FlowLinkArrow from '../ui/screen-map/FlowLinkArrow';
import { Button } from '../ui';
import '../styles/real-screen-map.css';

const MARKER_ID = 'real-map-arrowhead';
const ZOOM_STEPS = [0.35, 0.5, 0.65, 0.8, 1];

export default function RealScreenMapPage() {
  const viewportRef = useRef(null);
  const [zoomIndex, setZoomIndex] = useState(1);

  const zoom = ZOOM_STEPS[zoomIndex];

  const linkElements = useMemo(
    () =>
      realMapLinks
        .map((link) => {
          const fromNode = getRealMapNodeById(link.from);
          const toNode = getRealMapNodeById(link.to);
          if (!fromNode || !toNode) return null;
          return (
            <FlowLinkArrow
              key={`${link.from}-${link.to}-${link.label}`}
              fromCenter={getNodeCenter(fromNode)}
              toCenter={getNodeCenter(toNode)}
              label={link.label}
              markerId={MARKER_ID}
            />
          );
        })
        .filter(Boolean),
    []
  );

  const zoomIn = useCallback(() => {
    setZoomIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomIndex((i) => Math.max(i - 1, 0));
  }, []);

  const fitView = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const scaleW = (vp.clientWidth - 48) / REAL_MAP_CANVAS.width;
    const scaleH = (vp.clientHeight - 48) / REAL_MAP_CANVAS.height;
    const fit = Math.min(scaleW, scaleH, 1);
    const idx = ZOOM_STEPS.reduce(
      (best, z, i) => (Math.abs(z - fit) < Math.abs(ZOOM_STEPS[best] - fit) ? i : best),
      0
    );
    setZoomIndex(idx);
    vp.scrollLeft = 0;
    vp.scrollTop = 0;
  }, []);

  return (
    <div className="real-screen-map-page">
      <header className="real-screen-map-page__toolbar">
        <div>
          <h1>页面地图 · 真实页面版</h1>
          <p>
            画布 {REAL_MAP_CANVAS.width}×{REAL_MAP_CANVAS.height}px · Demo 实页 iframe + 系统截图 ·
            多状态分帧展示
          </p>
        </div>
        <div className="real-screen-map-page__actions">
          <Button type="button" variant="ghost" size="sm" onClick={zoomOut} disabled={zoomIndex === 0}>
            缩小
          </Button>
          <span className="real-screen-map-page__zoom">{Math.round(zoom * 100)}%</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
          >
            放大
          </Button>
          <Button type="button" variant="default" size="sm" onClick={fitView}>
            适应窗口
          </Button>
          <Link to="/screen-map">
            <Button type="button" variant="ghost" size="sm">
              低保真版
            </Button>
          </Link>
          <Link to="/prototype">
            <Button type="button" variant="primary" size="sm">
              Prototype View
            </Button>
          </Link>
        </div>
      </header>

      <div className="real-screen-map-page__legend">
        <span className="real-screen-map-page__legend-item">
          <span className="real-screen-map-page__dot real-screen-map-page__dot--live" />
          iframe 实时页面
        </span>
        <span className="real-screen-map-page__legend-item">
          <span className="real-screen-map-page__dot real-screen-map-page__dot--img" />
          系统真实截图
        </span>
        <span className="real-screen-map-page__legend-item">→ 箭头为跳转说明</span>
      </div>

      <div className="real-screen-map-page__viewport" ref={viewportRef}>
        <div
          className="real-screen-map-page__stage"
          style={{
            width: REAL_MAP_CANVAS.width,
            height: REAL_MAP_CANVAS.height,
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <svg
            className="real-screen-map-page__svg"
            width={REAL_MAP_CANVAS.width}
            height={REAL_MAP_CANVAS.height}
            aria-hidden
          >
            <defs>
              <marker
                id={MARKER_ID}
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="#595959" />
              </marker>
            </defs>
            {linkElements}
          </svg>

          {realMapNodes.map((node) => (
            <RealPageFrame key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
