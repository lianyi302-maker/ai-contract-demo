import Button from '../primitives/Button';

const TYPE_ICON = {
  contract: '📄',
  lotList: '📋',
  default: '📎',
};

/**
 * @param {{ id: string, name: string, type?: string, size?: string, uploadedAt?: string }[]} files
 */
export default function FileList({ files = [], onRemove, emptyText = '暂无文件', className = '' }) {
  if (!files.length) {
    return (
      <p className={`ui-field__hint ${className}`.trim()} style={{ margin: 0 }}>
        {emptyText}
      </p>
    );
  }

  return (
    <ul className={`ui-file-list ${className}`.trim()} aria-label="已上传文件">
      {files.map((file) => (
        <li key={file.id} className="ui-file-list__item">
          <span className="ui-file-list__icon" aria-hidden>
            {TYPE_ICON[file.type] || TYPE_ICON.default}
          </span>
          <div className="ui-file-list__info">
            <div className="ui-file-list__name">{file.name}</div>
            <div className="ui-file-list__meta">
              {[file.size, file.uploadedAt].filter(Boolean).join(' · ')}
            </div>
          </div>
          {onRemove ? (
            <Button variant="ghost" size="sm" type="button" onClick={() => onRemove(file.id)}>
              移除
            </Button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
