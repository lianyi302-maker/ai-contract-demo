/**
 * 上传区 — 纸质主合同 / 拍品清单
 * @param {string[]} acceptLabels - 展示用类型说明
 */
export default function UploadDropzone({
  title = '拖拽文件到此处，或点击上传',
  hint = '支持 PDF、图片；拍品清单支持 Excel',
  acceptLabels = ['主合同 PDF', '拍品清单 Excel'],
  active = false,
  onClick,
  className = '',
}) {
  return (
    <div
      className={`ui-upload ${active ? 'ui-upload--active' : ''} ${className}`.trim()}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <div className="ui-upload__icon" aria-hidden>
        ↑
      </div>
      <p className="ui-upload__title">{title}</p>
      <p className="ui-upload__hint">{hint}</p>
      {acceptLabels?.length > 0 ? (
        <div className="ui-upload__types">
          {acceptLabels.map((label) => (
            <span key={label} className="ui-badge ui-badge--neutral">
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
