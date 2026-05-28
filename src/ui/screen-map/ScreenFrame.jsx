import { Link } from 'react-router-dom';

/**
 * 单个页面缩略卡片
 */
export default function ScreenFrame({
  id,
  name,
  path,
  href,
  selected = false,
  style,
  className = '',
  onClick,
  asLink = true,
}) {
  const classNames = [
    'ui-screen-frame',
    selected && 'ui-screen-frame--selected',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <div className="ui-screen-frame__id">{id}</div>
      <div className="ui-screen-frame__name">{name}</div>
      {path ? <div className="ui-screen-frame__path">{path}</div> : null}
    </>
  );

  if (asLink && href && !onClick) {
    return (
      <Link to={href} className={classNames} style={style} title={name}>
        {content}
      </Link>
    );
  }

  return (
    <div
      className={classNames}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
    >
      {content}
    </div>
  );
}
