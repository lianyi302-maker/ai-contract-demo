import { useMemo, useState } from 'react';
import { FIELD_STATUS } from '../../ui/constants';
import FieldStatusTag from '../../ui/schema/FieldStatusTag';
import Button from '../../ui/primitives/Button';

const FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: FIELD_STATUS.MISSING, label: '缺失' },
  { key: FIELD_STATUS.LOW_CONFIDENCE, label: '低置信度' },
  { key: FIELD_STATUS.CONFLICT, label: '冲突' },
  { key: FIELD_STATUS.MUST_CONFIRM, label: '必须确认' },
];

function getCell(row, key) {
  return row.cells?.[key] || { value: '', status: FIELD_STATUS.NORMAL };
}

function rowHasStatus(row, status) {
  if (status === 'all') return true;
  return Object.values(row.cells || {}).some((c) => c?.status === status);
}

/**
 * 通用线上表格 — schema columns + rows with cells
 */
export default function OnlineDataTable({
  columns = [],
  rows = [],
  onRowsChange,
  onBatchConfirm,
  title,
}) {
  const [filter, setFilter] = useState('all');

  const filteredRows = useMemo(
    () => rows.filter((r) => rowHasStatus(r, filter)),
    [rows, filter]
  );

  const updateCell = (rowId, key, value) => {
    onRowsChange?.(
      rows.map((row) => {
        if (row.id !== rowId) return row;
        return {
          ...row,
          cells: {
            ...row.cells,
            [key]: {
              ...(row.cells[key] || {}),
              value,
              status: FIELD_STATUS.MODIFIED,
            },
          },
        };
      })
    );
  };

  const toggleSelect = (rowId) => {
    onRowsChange?.(
      rows.map((row) =>
        row.id === rowId ? { ...row, selected: !row.selected } : row
      )
    );
  };

  const batchConfirmSelected = () => {
    onRowsChange?.(
      rows.map((row) => {
        if (!row.selected) return row;
        const nextCells = { ...row.cells };
        Object.keys(nextCells).forEach((k) => {
          const c = nextCells[k];
          if (
            c &&
            [FIELD_STATUS.MISSING, FIELD_STATUS.LOW_CONFIDENCE, FIELD_STATUS.MUST_CONFIRM].includes(
              c.status
            )
          ) {
            nextCells[k] = { ...c, status: FIELD_STATUS.NORMAL };
          }
        });
        return { ...row, cells: nextCells, selected: false };
      })
    );
    onBatchConfirm?.();
  };

  return (
    <div className="demo-online-table">
      {title ? <h2 className="demo-online-table__title">{title}</h2> : null}
      <div className="demo-online-table__toolbar">
        <div className="demo-online-table__filters">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`demo-filter-chip ${filter === opt.key ? 'demo-filter-chip--active' : ''}`}
              onClick={() => setFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button type="button" variant="primary" size="sm" onClick={batchConfirmSelected}>
          批量确认选中行
        </Button>
      </div>
      <div className="ui-lot-table-wrap demo-online-table__scroll">
        <table className="ui-lot-table">
          <thead>
            <tr>
              <th style={{ width: 40 }} />
              {columns.map((col) => (
                <th key={col.key} style={{ minWidth: col.width || 100 }}>
                  {col.required ? '*' : ''}
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={Boolean(row.selected)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                {columns.map((col) => {
                  const c = getCell(row, col.key);
                  const st = c.status || FIELD_STATUS.NORMAL;
                  return (
                    <td key={col.key} className={st !== FIELD_STATUS.NORMAL ? `ui-cell--${st}` : ''}>
                      {col.type === 'select' ? (
                        <select
                          className="ui-lot-table__cell-input"
                          value={c.value ?? ''}
                          onChange={(e) => updateCell(row.id, col.key, e.target.value)}
                        >
                          <option value="">请选择</option>
                          {(col.options || []).map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="ui-lot-table__cell-input"
                          value={c.value ?? ''}
                          onChange={(e) => updateCell(row.id, col.key, e.target.value)}
                        />
                      )}
                      <FieldStatusTag status={st} />
                      {c.hint ? (
                        <div className="demo-cell-hint">{c.hint}</div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="demo-online-table__meta">
        显示 {filteredRows.length} / {rows.length} 行
      </p>
    </div>
  );
}
