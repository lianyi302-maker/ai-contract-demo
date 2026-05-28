import { FIELD_TYPE } from '../../schemas/shared';
import { FIELD_STATUS } from '../constants';
import FieldStatusTag from '../schema/FieldStatusTag';
import AiSourcePopover from './AiSourcePopover';
import LotStatusTag from './LotStatusTag';

function formatMoney(val) {
  if (val == null || val === '') return '';
  const n = parseFloat(String(val).replace(/,/g, ''));
  if (!Number.isFinite(n)) return val;
  return n.toLocaleString('zh-CN');
}

function getCellValue(cell) {
  if (cell == null) return '';
  if (typeof cell === 'object' && 'value' in cell) {
    const v = cell.value;
    if (v && typeof v === 'object' && !Array.isArray(v)) return v;
    return v ?? '';
  }
  return cell;
}

function getCellStatus(cell) {
  if (cell && typeof cell === 'object' && cell.status) return cell.status;
  return FIELD_STATUS.NORMAL;
}

/**
 * 按 lotColumnsSchema 列类型渲染单元格
 */
export default function LotCellRenderer({
  column,
  cell,
  row,
  onChange,
  readOnly = false,
}) {
  const status = getCellStatus(cell);
  const value = getCellValue(cell);
  const statusClass =
    status && status !== FIELD_STATUS.NORMAL ? `ui-cell--${status}` : '';
  const showTag = status !== FIELD_STATUS.NORMAL;

  if (column.type === FIELD_TYPE.ACTION && column.key === 'selected') {
    return (
      <input
        type="checkbox"
        checked={Boolean(row.selected)}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label="选择行"
      />
    );
  }

  if (column.type === FIELD_TYPE.NUMBER && column.key === 'rowIndex') {
    return <span>{row.rowIndex ?? ''}</span>;
  }

  if (column.type === FIELD_TYPE.STATUS || column.key === 'auditStatus') {
    return (
      <LotStatusTag statusKey={row.auditStatus} rejectReason={row.rejectReason} />
    );
  }

  if (column.type === FIELD_TYPE.DIMENSION) {
    const dim = typeof value === 'object' ? value : { length: '', width: '', height: '' };
    const sub = column.subFields || ['length', 'width', 'height'];
    return (
      <div className={`ui-lot-dimension ${statusClass}`}>
        {sub.map((sk) => (
          <input
            key={sk}
            className="ui-lot-table__cell-input"
            placeholder={sk === 'length' ? '长' : sk === 'width' ? '宽' : '高'}
            value={dim[sk] ?? ''}
            readOnly={readOnly || !column.editable}
            onChange={(e) =>
              onChange?.({ ...dim, [sk]: e.target.value }, FIELD_STATUS.MODIFIED)
            }
          />
        ))}
        {showTag ? (
          <AiSourcePopover cell={cell}>
            <FieldStatusTag status={status} />
          </AiSourcePopover>
        ) : null}
      </div>
    );
  }

  if (column.type === FIELD_TYPE.SELECT) {
    return (
      <div className={statusClass}>
        <select
          className="ui-lot-table__cell-input"
          value={value}
          disabled={readOnly || !column.editable}
          onChange={(e) => onChange?.(e.target.value, FIELD_STATUS.MODIFIED)}
        >
          <option value="">请选择</option>
          {(column.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {showTag ? (
          <div className="ui-lot-cell__tag-row">
            <AiSourcePopover cell={cell}>
              <FieldStatusTag status={status} />
            </AiSourcePopover>
          </div>
        ) : null}
      </div>
    );
  }

  if (column.type === FIELD_TYPE.TEXTAREA) {
    return (
      <div className={statusClass}>
        <textarea
          className="ui-lot-table__cell-input ui-lot-table__cell-textarea"
          rows={2}
          value={value}
          readOnly={readOnly || !column.editable}
          placeholder={status === FIELD_STATUS.MISSING ? '请输入' : ''}
          onChange={(e) => onChange?.(e.target.value, FIELD_STATUS.MODIFIED)}
        />
        {showTag ? (
          <div className="ui-lot-cell__tag-row">
            <FieldStatusTag status={status} />
          </div>
        ) : null}
      </div>
    );
  }

  if (column.type === FIELD_TYPE.MONEY) {
    return (
      <div className={statusClass}>
        <input
          className="ui-lot-table__cell-input ui-lot-table__cell-money"
          value={value}
          readOnly={readOnly || !column.editable}
          placeholder={status === FIELD_STATUS.MISSING ? '请输入' : ''}
          onChange={(e) => onChange?.(e.target.value.replace(/,/g, ''), FIELD_STATUS.MODIFIED)}
        />
        {showTag ? (
          <div className="ui-lot-cell__tag-row">
            <AiSourcePopover cell={cell}>
              <FieldStatusTag status={status} />
            </AiSourcePopover>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={statusClass}>
      <input
        className="ui-lot-table__cell-input"
        value={typeof value === 'object' ? '' : value}
        readOnly={readOnly || !column.editable}
        placeholder={status === FIELD_STATUS.MISSING ? '请输入' : ''}
        onChange={(e) => onChange?.(e.target.value, FIELD_STATUS.MODIFIED)}
      />
      {column.inlineActions?.length ? (
        <div className="ui-lot-cell__inline-actions">
          {column.inlineActions.map((a) => (
            <button key={a} type="button" className="ui-lot-cell__link" onClick={() => {}}>
              {a === 'copy' ? '复制' : '修改'}
            </button>
          ))}
        </div>
      ) : null}
      {showTag ? (
        <div className="ui-lot-cell__tag-row">
          <AiSourcePopover cell={cell}>
            <FieldStatusTag status={status} />
          </AiSourcePopover>
        </div>
      ) : null}
    </div>
  );
}
