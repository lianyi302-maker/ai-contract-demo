import { FIELD_STATUS } from '../ui/constants';

const cell = (value, status = FIELD_STATUS.NORMAL, extra = {}) => ({
  value,
  status,
  ...extra,
});

/** 拍品清单页 mock draftData */
export const lotListDraft = {
  meta: {
    listNo: 'F2024567890',
    taskId: 'task-demo-001',
    pageId: 'P05',
    lastSavedAt: '15:14',
  },
  statusFilters: ['maintenance', 'pendingReview', 'approved', 'rejected'],
  lots: [
    {
      id: 'L1',
      selected: true,
      rowIndex: 1,
      auditStatus: 'maintenance',
      cells: {
        contractNo: cell('CN-2025-SPR-00821', FIELD_STATUS.NORMAL),
        lotContractNo: cell('LOT-1001', FIELD_STATUS.SYSTEM_GENERATED),
        authorEra: cell('清乾隆', FIELD_STATUS.NORMAL),
        lotName: cell('青花缠枝莲纹瓶', FIELD_STATUS.NORMAL),
        texture: cell('porcelain', FIELD_STATUS.NORMAL),
        form: cell('瓶', FIELD_STATUS.NORMAL),
        dimensions: cell({ length: '32', width: '', height: '' }, FIELD_STATUS.LOW_CONFIDENCE),
        condition: cell('完好', FIELD_STATUS.NORMAL),
        insurancePrice: cell('800000', FIELD_STATUS.NORMAL),
        reservePrice: cell('600000', FIELD_STATUS.MUST_CONFIRM),
        storagePrice: cell('', FIELD_STATUS.NORMAL),
        sourceA: cell('trade', FIELD_STATUS.NORMAL),
        sourceB: cell('domestic', FIELD_STATUS.NORMAL),
        lotType: cell('lot', FIELD_STATUS.NORMAL),
        consignorBackground: cell('', FIELD_STATUS.NORMAL),
        bondedStatus: cell('no', FIELD_STATUS.NORMAL),
        plannedAuctionPeriod: cell('2025spring', FIELD_STATUS.NORMAL),
        coverRemarks: cell('', FIELD_STATUS.NORMAL),
      },
    },
    {
      id: 'L2',
      selected: false,
      rowIndex: 2,
      auditStatus: 'pendingReview',
      cells: {
        contractNo: cell('CN-2025-SPR-00821', FIELD_STATUS.NORMAL),
        lotContractNo: cell('LOT-1002', FIELD_STATUS.SYSTEM_GENERATED),
        authorEra: cell('民国', FIELD_STATUS.NORMAL),
        lotName: cell('粉彩花鸟纹盘', FIELD_STATUS.LOW_CONFIDENCE),
        texture: cell('porcelain', FIELD_STATUS.NORMAL),
        form: cell('盘', FIELD_STATUS.NORMAL),
        dimensions: cell({ length: '18', width: '18', height: '' }, FIELD_STATUS.NORMAL),
        condition: cell('轻微磨损', FIELD_STATUS.NORMAL),
        insurancePrice: cell('120000', FIELD_STATUS.NORMAL),
        reservePrice: cell('90000', FIELD_STATUS.LOW_CONFIDENCE),
        storagePrice: cell('500', FIELD_STATUS.NORMAL),
        sourceA: cell('inherit', FIELD_STATUS.NORMAL),
        sourceB: cell('domestic', FIELD_STATUS.NORMAL),
        lotType: cell('lot', FIELD_STATUS.NORMAL),
        consignorBackground: cell('家族旧藏', FIELD_STATUS.NORMAL),
        bondedStatus: cell('shanghaiEntry', FIELD_STATUS.MUST_CONFIRM),
        plannedAuctionPeriod: cell('2025spring', FIELD_STATUS.NORMAL),
        coverRemarks: cell('', FIELD_STATUS.NORMAL),
      },
    },
    {
      id: 'L3',
      selected: false,
      rowIndex: 3,
      auditStatus: 'approved',
      cells: {
        contractNo: cell('CN-2025-SPR-00821', FIELD_STATUS.NORMAL),
        lotContractNo: cell('LOT-1003', FIELD_STATUS.SYSTEM_GENERATED),
        authorEra: cell('齐白石', FIELD_STATUS.NORMAL),
        lotName: cell('山水画', FIELD_STATUS.NORMAL),
        texture: cell('painting', FIELD_STATUS.NORMAL),
        form: cell('立轴', FIELD_STATUS.NORMAL),
        dimensions: cell({ length: '68', width: '45', height: '' }, FIELD_STATUS.NORMAL),
        condition: cell('良好', FIELD_STATUS.NORMAL),
        insurancePrice: cell('1200000', FIELD_STATUS.NORMAL),
        reservePrice: cell('1000000', FIELD_STATUS.NORMAL),
        storagePrice: cell('', FIELD_STATUS.NORMAL),
        sourceA: cell('trade', FIELD_STATUS.NORMAL),
        sourceB: cell('domestic', FIELD_STATUS.NORMAL),
        lotType: cell('lot', FIELD_STATUS.NORMAL),
        consignorBackground: cell('', FIELD_STATUS.NORMAL),
        bondedStatus: cell('no', FIELD_STATUS.NORMAL),
        plannedAuctionPeriod: cell('2025autumn', FIELD_STATUS.NORMAL),
        coverRemarks: cell('', FIELD_STATUS.NORMAL),
      },
    },
    {
      id: 'L4',
      selected: false,
      rowIndex: 4,
      auditStatus: 'rejected',
      rejectReason: '保留价与保险价比例异常',
      cells: {
        contractNo: cell('CN-2025-OTHER', FIELD_STATUS.CONFLICT, {
          hint: '与主合同表格编号不一致',
          systemValue: 'CN-2025-SPR-00821',
          aiValue: 'CN-2025-OTHER',
        }),
        lotContractNo: cell('LOT-1004', FIELD_STATUS.SYSTEM_GENERATED),
        authorEra: cell('', FIELD_STATUS.MISSING),
        lotName: cell('玉器摆件', FIELD_STATUS.NORMAL),
        texture: cell('jade', FIELD_STATUS.NORMAL),
        form: cell('', FIELD_STATUS.MISSING),
        dimensions: cell({ length: '', width: '', height: '' }, FIELD_STATUS.MISSING),
        condition: cell('', FIELD_STATUS.MISSING),
        insurancePrice: cell('200000', FIELD_STATUS.NORMAL),
        reservePrice: cell('500000', FIELD_STATUS.CONFLICT, {
          hint: '保留价高于保险价',
        }),
        storagePrice: cell('', FIELD_STATUS.NORMAL),
        sourceA: cell('', FIELD_STATUS.MISSING),
        sourceB: cell('', FIELD_STATUS.MISSING),
        lotType: cell('lot', FIELD_STATUS.NORMAL),
        consignorBackground: cell('', FIELD_STATUS.NORMAL),
        bondedStatus: cell('', FIELD_STATUS.MISSING),
        plannedAuctionPeriod: cell('2025spring', FIELD_STATUS.NORMAL),
        coverRemarks: cell('', FIELD_STATUS.NORMAL),
      },
    },
    {
      id: 'L5',
      selected: false,
      rowIndex: 5,
      auditStatus: 'maintenance',
      cells: {
        contractNo: cell('', FIELD_STATUS.MISSING),
        lotContractNo: cell('', FIELD_STATUS.NORMAL),
        authorEra: cell('', FIELD_STATUS.MISSING),
        lotName: cell('', FIELD_STATUS.MISSING),
        texture: cell('', FIELD_STATUS.MISSING),
        form: cell('', FIELD_STATUS.MISSING),
        dimensions: cell({ length: '', width: '', height: '' }, FIELD_STATUS.MISSING),
        condition: cell('', FIELD_STATUS.MISSING),
        insurancePrice: cell('', FIELD_STATUS.MISSING),
        reservePrice: cell('', FIELD_STATUS.MISSING),
        storagePrice: cell('', FIELD_STATUS.NORMAL),
        sourceA: cell('', FIELD_STATUS.MISSING),
        sourceB: cell('', FIELD_STATUS.MISSING),
        lotType: cell('', FIELD_STATUS.MISSING),
        consignorBackground: cell('', FIELD_STATUS.NORMAL),
        bondedStatus: cell('', FIELD_STATUS.MISSING),
        plannedAuctionPeriod: cell('', FIELD_STATUS.MISSING),
        coverRemarks: cell('', FIELD_STATUS.NORMAL),
      },
    },
  ],
};

/** 将 draft 行转为便于汇总的保留价数字 */
export function sumReservePrice(lots, { selectedOnly = false } = {}) {
  return lots
    .filter((row) => !selectedOnly || row.selected)
    .reduce((sum, row) => {
      const raw = row.cells?.reservePrice?.value;
      const n = parseFloat(String(raw || '').replace(/,/g, ''));
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
}
