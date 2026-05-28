import { Link } from 'react-router-dom';

const IFRAME_NATURAL = { width: 1440, height: 900 };

/**
 * 真实页面预览框（iframe 缩放或系统截图）
 */
export default function RealPageFrame({ node }) {
  const scale = node.width / IFRAME_NATURAL.width;

  return (
    <article
      className="real-map-frame"
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
      }}
      id={`map-node-${node.id}`}
    >
      <header className="real-map-frame__head">
        <span className="real-map-frame__page-id">{node.pageId}</span>
        <h3 className="real-map-frame__title">{node.name}</h3>
        <span className="real-map-frame__state">{node.stateLabel}</span>
      </header>

      <div className="real-map-frame__viewport">
        {node.previewType === 'image' ? (
          <img
            src={node.previewSrc}
            alt={`${node.name} · ${node.stateLabel}`}
            className="real-map-frame__image"
            loading="lazy"
          />
        ) : (
          <div
            className="real-map-frame__iframe-wrap"
            style={{ height: IFRAME_NATURAL.height * scale }}
          >
            <iframe
              title={`${node.pageId} ${node.stateLabel}`}
              src={node.previewSrc}
              className="real-map-frame__iframe"
              style={{
                width: IFRAME_NATURAL.width,
                height: IFRAME_NATURAL.height,
                transform: `scale(${scale})`,
              }}
              tabIndex={-1}
            />
          </div>
        )}
      </div>

      {node.openHref ? (
        <footer className="real-map-frame__foot">
          <Link to={node.openHref} target="_blank" rel="noreferrer" className="real-map-frame__link">
            打开可交互页面 ↗
          </Link>
        </footer>
      ) : null}
    </article>
  );
}
