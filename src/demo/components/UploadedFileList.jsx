/**
 * 已上传文件列表（对话任务卡片内）
 */
export default function UploadedFileList({ files = [], onRemove, className = '' }) {
  if (!files.length) {
    return <p className="upload-file-list__empty">暂无文件</p>;
  }

  return (
    <ul className={`upload-file-list ${className}`.trim()}>
      {files.map((file) => (
        <li key={file.id} className="upload-file-list__item">
          <span className="upload-file-list__icon" aria-hidden />
          <span className="upload-file-list__name">{file.name}</span>
          {file.size ? <span className="upload-file-list__size">{file.size}</span> : null}
          {onRemove ? (
            <button
              type="button"
              className="upload-file-list__remove"
              onClick={() => onRemove(file.id)}
              aria-label={`移除 ${file.name}`}
            >
              ×
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
