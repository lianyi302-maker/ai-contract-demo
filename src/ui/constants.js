/** 字段 / 单元格状态 — 全库统一（含 draftData.status） */
export const FIELD_STATUS = {
  NORMAL: 'normal',
  MISSING: 'missing',
  LOW_CONFIDENCE: 'lowConfidence',
  CONFLICT: 'conflict',
  MODIFIED: 'modified',
  SYSTEM_GENERATED: 'systemGenerated',
  MUST_CONFIRM: 'mustConfirm',
};

export const FIELD_STATUS_LABEL = {
  [FIELD_STATUS.NORMAL]: '',
  [FIELD_STATUS.MISSING]: '缺失',
  [FIELD_STATUS.LOW_CONFIDENCE]: '低置信度',
  [FIELD_STATUS.CONFLICT]: '冲突',
  [FIELD_STATUS.MODIFIED]: '已人工修改',
  [FIELD_STATUS.SYSTEM_GENERATED]: '系统生成',
  [FIELD_STATUS.MUST_CONFIRM]: '必须确认',
};

/** @deprecated 使用 CONFLICT */
export const FIELD_STATUS_ERROR = 'error';

/** P01–P08 流程步骤（与 screens.js 对齐） */
export const FLOW_STEPS = [
  { id: 'P01', label: '上传材料' },
  { id: 'P02', label: 'AI识别' },
  { id: 'P03', label: '结果预览' },
  { id: 'P04', label: '主合同确认' },
  { id: 'P05', label: '拍品清单' },
  { id: 'P06', label: 'AI对话' },
  { id: 'P07', label: '导出草稿' },
  { id: 'P08', label: '提交检查' },
];
