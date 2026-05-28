/**
 * 附件 / 合同照片预览
 * @param {{ id: string, name: string, url?: string }[]} files
 */
export default function AttachmentPreview({
  files = [],
  emptyText = '暂无上传文件',
  onUpload,
  className = '',
}) {
  if (!files.length) {
    return (
      <div className={`ui-attachment-empty ${className}`.trim()}>
        <p>{emptyText}</p>
        {onUpload ? (
          <button type="button" className="ui-btn ui-btn--ghost" onClick={onUpload}>
            上传
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <ul className={`ui-attachment-grid ${className}`.trim()}>
      {files.map((file) => (
        <li key={file.id} className="ui-attachment-grid__item">
          {file.url ? (
            <img src={file.url} alt={file.name} />
          ) : (
            <div className="ui-attachment-grid__placeholder">{file.name}</div>
          )}
          <span className="ui-attachment-grid__name">{file.name}</span>
        </li>
      ))}
    </ul>
  );
}
