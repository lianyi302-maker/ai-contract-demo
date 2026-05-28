export default function DraftPreviewCard({
  title,
  imageSrc,
  imageAlt,
  source = 'AI识别结果生成',
  status = '待人工最终审核',
  className = '',
}) {
  return (
    <article className={`demo-draft-card ${className}`.trim()}>
      <h3 className="demo-draft-card__title">{title}</h3>
      <div className="demo-draft-card__image-wrap">
        <img src={imageSrc} alt={imageAlt} className="demo-draft-card__image" />
      </div>
      <ul className="demo-draft-card__meta">
        <li>
          <span>来源</span>
          {source}
        </li>
        <li>
          <span>状态</span>
          {status}
        </li>
        <li>
          <span>操作</span>
          <button type="button" className="demo-draft-card__link" onClick={() => window.alert('[Demo] 进入原系统继续编辑')}>
            可进入原系统继续编辑
          </button>
        </li>
      </ul>
    </article>
  );
}
