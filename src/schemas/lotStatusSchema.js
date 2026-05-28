/**
 * 拍品业务审核状态 — 列「拍品状态」/ 筛选区
 */
export const lotAuditStatusSchema = {
  id: 'lotAuditStatus',
  version: '0.2.0',
  statuses: [
    { key: 'maintenance', label: '维护中', filterLabel: '维护中', color: 'blue' },
    { key: 'pendingReview', label: '待审核', filterLabel: '待审核', color: 'orange' },
    { key: 'approved', label: '审核通过', filterLabel: '审核通过', color: 'green' },
    {
      key: 'rejected',
      label: '未通过',
      filterLabel: '退回',
      aliases: ['退回'],
      color: 'red',
      showRejectReason: true,
    },
  ],
};

/** 字段级状态 key — 与 src/ui/constants.js FIELD_STATUS 对齐 */
export const LOT_FIELD_STATUS = {
  NORMAL: 'normal',
  MISSING: 'missing',
  LOW_CONFIDENCE: 'lowConfidence',
  CONFLICT: 'conflict',
  MODIFIED: 'modified',
  MUST_CONFIRM: 'mustConfirm',
  SYSTEM_GENERATED: 'systemGenerated',
};

/**
 * 字段级 AI / 数据状态 — 单元格 FieldStatusTag
 */
export const lotFieldStatusSchema = {
  id: 'lotFieldStatus',
  version: '0.2.0',
  statuses: [
    { key: LOT_FIELD_STATUS.NORMAL, label: '正常', description: '已核对或无异常' },
    { key: LOT_FIELD_STATUS.MISSING, label: '缺失', description: '必填为空或合同编号无法匹配' },
    { key: LOT_FIELD_STATUS.LOW_CONFIDENCE, label: '低置信度', description: 'AI 抽取置信度低' },
    {
      key: LOT_FIELD_STATUS.CONFLICT,
      label: '冲突',
      description: '合同编号不匹配、金额不一致、Excel 与识别值不一致',
    },
    { key: LOT_FIELD_STATUS.MODIFIED, label: '已人工修改', description: '用户手工修改过' },
    { key: LOT_FIELD_STATUS.MUST_CONFIRM, label: '必须人工确认', description: '保留价、保税状态等' },
    { key: LOT_FIELD_STATUS.SYSTEM_GENERATED, label: '系统生成', description: '序号、生成编号等' },
  ],
  severityOrder: [
    LOT_FIELD_STATUS.MISSING,
    LOT_FIELD_STATUS.CONFLICT,
    LOT_FIELD_STATUS.MUST_CONFIRM,
    LOT_FIELD_STATUS.LOW_CONFIDENCE,
    LOT_FIELD_STATUS.MODIFIED,
    LOT_FIELD_STATUS.SYSTEM_GENERATED,
    LOT_FIELD_STATUS.NORMAL,
  ],
};

export const lotStatusSchema = {
  ...lotFieldStatusSchema,
  auditStatuses: lotAuditStatusSchema.statuses,
};

export function getLotAuditStatusDef(key) {
  return lotAuditStatusSchema.statuses.find((s) => s.key === key);
}

export function getLotFieldStatusDef(key) {
  return lotFieldStatusSchema.statuses.find((s) => s.key === key);
}

export function getLotStatusDef(statusKey) {
  return getLotFieldStatusDef(statusKey);
}

export function aggregateFieldStatus(cellStatuses) {
  const order = lotFieldStatusSchema.severityOrder;
  for (const key of order) {
    if (cellStatuses.includes(key)) return key;
  }
  return LOT_FIELD_STATUS.NORMAL;
}
