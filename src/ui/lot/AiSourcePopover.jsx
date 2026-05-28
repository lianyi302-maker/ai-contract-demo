import { useState } from 'react';

/**
 * 冲突/低置信度时展示 AI 来源与系统值
 */
export default function AiSourcePopover({ cell, children }) {
  const [open, setOpen] = useState(false);
  const hasSource = cell?.aiValue != null || cell?.systemValue != null || cell?.hint;

  if (!hasSource) return children;

  return (
    <span className="ui-ai-popover-wrap">
      <button
        type="button"
        className="ui-ai-popover-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {children}
      </button>
      {open ? (
        <div className="ui-ai-popover" role="tooltip">
          {cell.hint ? <p className="ui-ai-popover__hint">{cell.hint}</p> : null}
          {cell.aiValue != null ? (
            <p>
              <strong>AI：</strong>
              {String(cell.aiValue)}
            </p>
          ) : null}
          {cell.systemValue != null ? (
            <p>
              <strong>系统：</strong>
              {String(cell.systemValue)}
            </p>
          ) : null}
        </div>
      ) : null}
    </span>
  );
}
