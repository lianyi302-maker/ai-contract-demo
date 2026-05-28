/**
 * 拍品清单页 — 页面级 schema（P05 / P07 复用）
 * 字段列定义见 lotColumnsSchema.js
 */
export const lotListSchema = {
  id: 'lotList',
  label: '拍品清单',
  version: '0.2.0',
  pageIds: ['P05', 'P07'],

  listMeta: {
    listNo: {
      key: 'listNo',
      label: '清单编号',
      editable: true,
    },
  },

  regions: [
    'contractTabs',
    'listHeader',
    'listToolbar',
    'statusFilter',
    'lotTable',
    'bottomActionBar',
  ],

  statusFilter: {
    summaryLabel: '共 {count} 件拍品',
    options: [
      { key: 'maintenance', label: '维护中' },
      { key: 'pendingReview', label: '待审核' },
      { key: 'approved', label: '审核通过' },
      { key: 'rejected', label: '退回' },
    ],
  },

  /** 清单级操作 — 不进入 field schema */
  listActions: [
    { key: 'legalTagging', label: '法务打标' },
    { key: 'generateLotCodes', label: '生成拍品编号' },
    { key: 'addLot', label: '添加拍品' },
    { key: 'deleteLots', label: '删除', requiresSelection: true },
    { key: 'downloadImportTemplate', label: '下载导入模板' },
    { key: 'batchImportLots', label: '批量导入拍品' },
  ],

  listHeaderActions: [{ key: 'editListNo', label: '修改' }],

  selectionActions: [
    { key: 'selectPage', label: '本页全选' },
    { key: 'selectAll', label: '全部全选' },
  ],

  /** 底栏汇总 — 不进入 lotColumnsSchema */
  bottomSummary: {
    selectedCountLabel: '已选 {count} 个拍品',
    reservePriceTotalLabel: '保留价总额 RMB {amount}',
    sumFieldKey: 'reservePrice',
    autoSaveHintLabel: '已于 {time} 保存',
  },

  actionBarKey: 'lotList',
  columnsSchemaRef: 'lotColumnsSchema',
  auditStatusSchemaRef: 'lotAuditStatus',
  fieldStatusSchemaRef: 'lotFieldStatus',
};

export const lotListActionSchema = lotListSchema.listActions;
