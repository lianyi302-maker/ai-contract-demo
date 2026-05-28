import FieldStatusTag from '../schema/FieldStatusTag';
import { FIELD_STATUS } from '../constants';

const DEFAULT_COLUMNS = [
  { key: 'name', label: '拍品名称', width: 'minmax(140px, 1.5fr)' },
  { key: 'spec', label: '规格', width: '100px' },
  { key: 'qty', label: '数量', width: '64px' },
  { key: 'unit', label: '单位', width: '64px' },
  { key: 'estimate', label: '估价', width: '100px' },
];

/**
 * 拍品清单表格
 * @param {{ id: string, [key]: string, status?: string }[]} rows
 */
export default function LotTable({
  rows = [],
  columns = DEFAULT_COLUMNS,
  onCellChange,
  showRowStatus = true,
  className = '',
}) {
  return (
    <div className={`ui-lot-table-wrap ${className}`.trim()}>
      <table className="ui-lot-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ minWidth: col.width }}>
                {col.label}
              </th>
            ))}
            {showRowStatus ? <th className="ui-lot-table__row-status">状态</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowStatus = row.status || FIELD_STATUS.NORMAL;
            return (
              <tr key={row.id}>
                {columns.map((col) => {
                  const cellStatus = row[`${col.key}Status`] || rowStatus;
                  const cellClass =
                    cellStatus && cellStatus !== FIELD_STATUS.NORMAL
                      ? `ui-cell--${cellStatus}`
                      : '';
                  return (
                    <td key={col.key} className={cellClass}>
                      <input
                        className="ui-lot-table__cell-input"
                        value={row[col.key] ?? ''}
                        readOnly={!onCellChange}
                        onChange={
                          onCellChange
                            ? (e) => onCellChange(row.id, col.key, e.target.value)
                            : undefined
                        }
                        aria-label={`${row.id} ${col.label}`}
                      />
                    </td>
                  );
                })}
                {showRowStatus ? (
                  <td>
                    <FieldStatusTag status={rowStatus} />
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
