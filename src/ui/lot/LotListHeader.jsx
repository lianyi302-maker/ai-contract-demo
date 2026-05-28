import Button from '../primitives/Button';

/**
 * 清单级信息：清单编号 + 修改
 */
export default function LotListHeader({
  listNo,
  listNoLabel = '清单编号',
  onEditListNo,
  className = '',
}) {
  return (
    <div className={`ui-lot-list-header ${className}`.trim()}>
      <span className="ui-lot-list-header__label">{listNoLabel}</span>
      <span className="ui-lot-list-header__no">{listNo}</span>
      {onEditListNo ? (
        <Button type="button" variant="ghost" size="sm" onClick={onEditListNo}>
          修改
        </Button>
      ) : null}
    </div>
  );
}
