/** 字段控件类型 */
export const FIELD_TYPE = {
  TEXT: 'text',
  SELECT: 'select',
  DATE: 'date',
  RADIO: 'radio',
  IMAGE_UPLOAD: 'imageUpload',
  ADDRESS: 'address',
  FEE_RULE: 'feeRule',
  CLAUSE: 'clause',
  ATTACHMENT: 'attachment',
  TEXTAREA: 'textarea',
  /** 拍品表格列类型 */
  MONEY: 'money',
  NUMBER: 'number',
  DIMENSION: 'dimension',
  ACTION: 'action',
  STATUS: 'status',
};

/** 数据来源 */
export const SOURCE_TYPE = {
  PAPER_CONTRACT: 'paperContract',
  SYSTEM_DEFAULT: 'systemDefault',
  MANUAL_CONFIRM: 'manualConfirm',
  RULE_CONFIG: 'ruleConfig',
  PAPER_LOT_LIST: 'paperLotList',
  AI_MATCHED: 'aiMatched',
  DICTIONARY_SELECT: 'dictionarySelect',
  AUDIT_STATUS: 'auditStatus',
};

/** 拍品列 AI 风险等级 */
export const AI_RISK = {
  NORMAL: 'normal',
  LOW_CONFIDENCE: 'lowConfidence',
  HIGH_RISK: 'highRisk',
};

/** 确认级别（schema 元数据，与 FIELD_STATUS 不同） */
export const CONFIRM_LEVEL = {
  AUTO_FILL: 'autoFill',
  NEED_CONFIRM: 'needConfirm',
  MUST_CONFIRM: 'mustConfirm',
};

/** 委托人类型 */
export const CONSIGNOR_TYPE = {
  PERSONAL: 'personal',
  ORGANIZATION: 'organization',
};

/**
 * 判断字段是否可见
 * @param {object} visibleWhen - e.g. { consignorType: 'personal' } 或 { consignorType: ['personal','organization'] }
 * @param {object} context - 当前表单上下文值 { consignorType: 'personal', ... }
 */
export function evaluateVisibleWhen(visibleWhen, context = {}) {
  if (!visibleWhen || typeof visibleWhen !== 'object') return true;
  return Object.entries(visibleWhen).every(([key, expected]) => {
    const actual = context[key];
    if (Array.isArray(expected)) return expected.includes(actual);
    return actual === expected;
  });
}

/** 从 draftData 取出字段值 */
export function getDraftValue(draftSlice, key) {
  const entry = draftSlice?.[key];
  if (entry == null) return '';
  if (typeof entry === 'object' && 'value' in entry) return entry.value ?? '';
  return entry;
}

/** 从 draftData 取出字段状态 */
export function getDraftStatus(draftSlice, key) {
  const entry = draftSlice?.[key];
  if (entry && typeof entry === 'object' && entry.status) return entry.status;
  return 'normal';
}

export function getDraftHint(draftSlice, key) {
  const entry = draftSlice?.[key];
  if (entry && typeof entry === 'object') return entry.hint;
  return undefined;
}
