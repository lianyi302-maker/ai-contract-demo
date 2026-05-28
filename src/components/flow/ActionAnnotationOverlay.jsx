import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnnotationMode } from '../../context/AnnotationModeContext';
import { getFlowSpecByActionId } from '../../flowSpec';
import ActionSpecPopover from './ActionSpecPopover';

/**
 * 在 Prototype 上为 data-flow-action 元素挂载编号徽标（不改变原有点击行为）
 */
export default function ActionAnnotationOverlay({ pageId }) {
  const { enabled } = useAnnotationMode();
  const [anchors, setAnchors] = useState([]);
  const [activeActionId, setActiveActionId] = useState(null);

  const refresh = useCallback(() => {
    const root = document.querySelector('[data-flow-prototype-root]');
    if (!root) {
      setAnchors([]);
      return;
    }
    const nodes = root.querySelectorAll('[data-flow-action]');
    const next = [];
    nodes.forEach((el) => {
      const actionId = el.getAttribute('data-flow-action');
      const spec = getFlowSpecByActionId(actionId);
      if (!spec) return;
      if (pageId && spec.fromPageId !== pageId) return;
      const rect = el.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      next.push({
        actionId,
        top: rect.top - rootRect.top + root.scrollTop,
        left: rect.left - rootRect.left + root.scrollLeft,
        width: rect.width,
      });
    });
    setAnchors(next);
  }, [pageId]);

  useEffect(() => {
    if (!enabled) {
      setAnchors([]);
      return undefined;
    }
    refresh();
    const root = document.querySelector('[data-flow-prototype-root]');
    const ro = new ResizeObserver(() => refresh());
    if (root) ro.observe(root);
    window.addEventListener('resize', refresh);
    const t = setTimeout(refresh, 300);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', refresh);
      clearTimeout(t);
    };
  }, [enabled, pageId, refresh]);

  if (!enabled) return null;

  const root = document.querySelector('[data-flow-prototype-root]');
  if (!root) return null;

  return createPortal(
    <>
      {anchors.map((a) => (
        <button
          key={a.actionId}
          type="button"
          className="flow-annotation-badge"
          style={{
            position: 'absolute',
            top: a.top + 4,
            left: a.left + a.width + 6,
            zIndex: 50,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setActiveActionId(a.actionId);
          }}
          title="查看跳转说明"
        >
          {a.actionId}
        </button>
      ))}
      {activeActionId ? (
        <div
          className="flow-spec-popover-backdrop"
          onClick={() => setActiveActionId(null)}
          role="presentation"
        >
          <div onClick={(e) => e.stopPropagation()} role="presentation">
            <ActionSpecPopover actionId={activeActionId} onClose={() => setActiveActionId(null)} />
          </div>
        </div>
      ) : null}
    </>,
    root
  );
}
