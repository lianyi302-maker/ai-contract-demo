import { lotColumnsSchema } from '../../schemas/lotColumnsSchema';
import LotCellRenderer from './LotCellRenderer';
import { FIELD_STATUS } from '../constants';

/**
 * schema 驱动的拍品表格
 */
export default function SchemaLotTable({
  columns = lotColumnsSchema.columns,
  rows = [],
  onCellChange,
  onRowSelect,
  className = '',
}) {
  return (
    <div className={`ui-lot-table-wrap ui-lot-table-wrap--schema ${className}`.trim()}>
      <table className="ui-lot-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ minWidth: col.width }}
                className={col.required ? 'ui-lot-th--required' : ''}
              >
                {col.required && col.label ? '*' : ''}
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-audit={row.auditStatus}>
              {columns.map((col) => {
                const cell =
                  col.key === 'auditStatus'
                    ? null
                    : row.cells?.[col.key];
                return (
                  <td key={col.key}>
                    <LotCellRenderer
                      column={col}
                      cell={cell}
                      row={row}
                      onChange={(val, status) => {
                        if (col.key === 'selected') {
                          onRowSelect?.(row.id, val);
                          return;
                        }
                        onCellChange?.(row.id, col.key, val, status || FIELD_STATUS.MODIFIED);
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
