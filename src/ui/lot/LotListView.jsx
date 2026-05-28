import { lotListSchema } from '../../schemas/lotListSchema';
import { lotColumnsSchema } from '../../schemas/lotColumnsSchema';
import { getActionBarConfig } from '../../schemas/actionBarSchema';
import { sumReservePrice } from '../../mock/lotListDraft';
import LotListHeader from './LotListHeader';
import LotToolbar from './LotToolbar';
import SchemaLotTable from './SchemaLotTable';
import LotBottomActionBar from './LotBottomActionBar';
import { FIELD_STATUS } from '../constants';

/**
 * 拍品清单页 — 由 lotListSchema + draftData 驱动
 */
export default function LotListView({
  draft,
  onUpdateDraft,
  className = '',
}) {
  const { meta, lots = [], statusFilters } = draft;
  const listActions = lotListSchema.listActions;
  const actionBar = getActionBarConfig(lotListSchema.actionBarKey);
  const selectedCount = lots.filter((r) => r.selected).length;
  const reserveTotal = sumReservePrice(lots, { selectedOnly: true });

  const handleCellChange = (rowId, colKey, value, status) => {
    onUpdateDraft?.((prev) => ({
      ...prev,
      lots: prev.lots.map((row) => {
        if (row.id !== rowId) return row;
        const nextCells = {
          ...row.cells,
          [colKey]: {
            ...(row.cells[colKey] || {}),
            value,
            status: status || FIELD_STATUS.MODIFIED,
          },
        };
        return { ...row, cells: nextCells };
      }),
    }));
  };

  const handleRowSelect = (rowId, selected) => {
    onUpdateDraft?.((prev) => ({
      ...prev,
      lots: prev.lots.map((row) =>
        row.id === rowId ? { ...row, selected } : row
      ),
    }));
  };

  return (
    <div className={`ui-lot-list-view ${className}`.trim()}>
      <div className="ui-lot-list-view__top">
        <LotListHeader
          listNo={meta?.listNo}
          onEditListNo={() => window.alert('[Demo] 修改清单编号')}
        />
        <LotToolbar
          actions={listActions}
          onAction={(key) => window.alert(`[Demo] ${key}`)}
        />
      </div>

      <div className="ui-lot-list-view__filter">
        <span>
          {lotListSchema.statusFilter.summaryLabel.replace('{count}', String(lots.length))}
        </span>
        {lotListSchema.statusFilter.options.map((opt) => (
          <label key={opt.key} className="ui-lot-filter-chip">
            <input type="checkbox" defaultChecked={statusFilters?.includes(opt.key)} readOnly />
            {opt.filterLabel || opt.label}
          </label>
        ))}
      </div>

      <SchemaLotTable
        columns={lotColumnsSchema.columns}
        rows={lots}
        onCellChange={handleCellChange}
        onRowSelect={handleRowSelect}
      />

      <LotBottomActionBar
        selectedCount={selectedCount}
        reservePriceTotal={reserveTotal}
        summaryConfig={lotListSchema.bottomSummary}
        selectionActions={lotListSchema.selectionActions}
        saveActions={actionBar?.actions}
        autoSaveHint={lotListSchema.bottomSummary.autoSaveHintLabel.replace(
          '{time}',
          meta?.lastSavedAt || '—'
        )}
        onSelectionAction={(key) => window.alert(`[Demo] ${key}`)}
        onSaveAction={(key) => window.alert(`[Demo] ${key}`)}
      />
    </div>
  );
}
