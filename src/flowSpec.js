/**
 * 流程结构唯一数据源 — Screen Map / Design Export / Annotation 均读取此文件
 */

/** @typedef {'button' | 'link' | 'tab' | 'card' | 'dialogAction'} ActionType */
/** @typedef {'normal' | 'needConfirm' | 'risk' | 'blocking'} RiskLevel */

/**
 * @typedef {Object} FlowPage
 * @property {string} id
 * @property {string} name
 * @property {string} summary
 * @property {string} demoPath
 * @property {string} [prototypePreset]
 */

/**
 * @typedef {Object} FlowSpecEntry
 * @property {string} id
 * @property {string} fromPageId
 * @property {string} fromPageName
 * @property {string} actionId
 * @property {string} actionLabel
 * @property {ActionType} actionType
 * @property {string} toPageId
 * @property {string} toPageName
 * @property {string} condition
 * @property {string} disabledCondition
 * @property {string} feedback
 * @property {RiskLevel} riskLevel
 * @property {string} note
 */

/** @type {FlowPage[]} */
export const flowPages = [
  {
    id: 'P01',
    name: 'AI 工作台',
    summary: '对话入口；可触发上传材料流程。',
    demoPath: '/demo',
    prototypePreset: 'workbench-init',
  },
  {
    id: 'P02',
    name: '上传识别页',
    summary: '上传主合同与拍品清单，mock 识别进度。',
    demoPath: '/demo/upload',
    prototypePreset: 'upload-idle',
  },
  {
    id: 'P03',
    name: '识别结果',
    summary: '工作台展示识别摘要与查看索引（主合同表 / 拍品表 / 下载 / 生成草稿）。',
    demoPath: '/demo',
    prototypePreset: 'workbench-indexed',
  },
  {
    id: 'P04',
    name: '主合同确认',
    summary: '主合同线上表格批量确认字段。',
    demoPath: '/demo/contract-table',
    prototypePreset: 'contract-pending',
  },
  {
    id: 'P05',
    name: '拍品清单确认',
    summary: '拍品清单线上表格确认与合同编号归属。',
    demoPath: '/demo/lot-table',
    prototypePreset: 'lot-pending',
  },
  {
    id: 'P06',
    name: 'AI 工作台（双表已确认）',
    summary: '主合同与拍品清单均已确认，可生成系统草稿。',
    demoPath: '/demo',
    prototypePreset: 'workbench-confirmed',
  },
  {
    id: 'P07',
    name: '草稿预览',
    summary: '草稿生成结果预览（截图仅作结果展示，非地图源头）。',
    demoPath: '/demo/draft-preview',
    prototypePreset: 'draft-done',
  },
  {
    id: 'P08',
    name: 'AI 工作台（草稿已生成）',
    summary: '草稿已生成，可进入提交审核检查。',
    demoPath: '/demo',
    prototypePreset: 'workbench-draft-ready',
  },
  {
    id: 'P09',
    name: '提交审核检查',
    summary: '提交前校验清单；Demo 仅模拟提交。',
    demoPath: '/demo/submit-check',
    prototypePreset: 'submit-check',
  },
  {
    id: 'P10',
    name: '客户信息线上确认',
    summary: '批量确认 AI 识别客户，创建或更新并同步至客户管理页面。',
    demoPath: '/demo/customer-confirm',
    prototypePreset: 'customer-pending',
  },
];

/** @type {FlowSpecEntry[]} */
export const flowSpec = [
  {
    id: 'T-001',
    fromPageId: 'P01',
    fromPageName: 'AI 工作台',
    actionId: 'A-P01-001',
    actionLabel: '上传材料',
    actionType: 'button',
    toPageId: 'P02',
    toPageName: '上传识别页',
    condition: '用户点击上传材料入口（对话卡片或快捷按钮）',
    disabledCondition: '无',
    feedback: '跳转至上传识别页',
    riskLevel: 'normal',
    note: '对应对话流中的 uploadEntry / uploadCard 入口。',
  },
  {
    id: 'T-002',
    fromPageId: 'P02',
    fromPageName: '上传识别页',
    actionId: 'A-P02-001',
    actionLabel: '开始识别',
    actionType: 'button',
    toPageId: 'P02',
    toPageName: '上传识别页',
    condition: '已选择主合同文件（mock 默认已有文件）',
    disabledCondition: '未选择任何文件时按钮不可用',
    feedback: '进入识别中状态，展示进度条与阶段文案',
    riskLevel: 'normal',
    note: '同页状态切换：upload → recognizing。',
  },
  {
    id: 'T-003',
    fromPageId: 'P02',
    fromPageName: '上传识别页',
    actionId: 'A-P02-002',
    actionLabel: '识别完成',
    actionType: 'link',
    toPageId: 'P03',
    toPageName: '识别结果',
    condition: '识别进度 100%（mock 定时完成）',
    disabledCondition: '无（系统自动）',
    feedback: '写回识别摘要并返回工作台，展示结果索引',
    riskLevel: 'normal',
    note: '无用户点击；识别结束后自动 navigate 至 /demo。',
  },
  {
    id: 'T-004',
    fromPageId: 'P03',
    fromPageName: '识别结果',
    actionId: 'A-P03-001',
    actionLabel: '查看主合同线上表格',
    actionType: 'button',
    toPageId: 'P04',
    toPageName: '主合同确认',
    condition: '识别已完成且结果索引已展示',
    disabledCondition: '无',
    feedback: '进入主合同线上表格确认页',
    riskLevel: 'normal',
    note: 'UI 按钮文案为「查看/确认」。',
  },
  {
    id: 'T-005',
    fromPageId: 'P03',
    fromPageName: '识别结果',
    actionId: 'A-P03-002',
    actionLabel: '查看拍品清单线上表格',
    actionType: 'button',
    toPageId: 'P05',
    toPageName: '拍品清单确认',
    condition: '识别已完成且结果索引已展示',
    disabledCondition: '无',
    feedback: '进入拍品清单线上表格确认页',
    riskLevel: 'normal',
    note: 'UI 按钮文案为「查看/确认」。',
  },
  {
    id: 'T-006',
    fromPageId: 'P03',
    fromPageName: '识别结果',
    actionId: 'A-P03-003',
    actionLabel: '下载主合同表格',
    actionType: 'button',
    toPageId: 'P03',
    toPageName: '识别结果',
    condition: '识别已完成',
    disabledCondition: '无',
    feedback: '弹出 [Demo] 下载主合同线上表格.csv 提示，不跳转',
    riskLevel: 'normal',
    note: '模拟下载，页面停留 P03。',
  },
  {
    id: 'T-007',
    fromPageId: 'P03',
    fromPageName: '识别结果',
    actionId: 'A-P03-004',
    actionLabel: '下载拍品清单表格',
    actionType: 'button',
    toPageId: 'P03',
    toPageName: '识别结果',
    condition: '识别已完成',
    disabledCondition: '无',
    feedback: '弹出 [Demo] 下载拍品清单线上表格.csv 提示，不跳转',
    riskLevel: 'normal',
    note: '模拟下载，页面停留 P03。',
  },
  {
    id: 'T-008',
    fromPageId: 'P03',
    fromPageName: '识别结果',
    actionId: 'A-P03-005',
    actionLabel: '生成草稿',
    actionType: 'button',
    toPageId: 'P07',
    toPageName: '草稿预览',
    condition: '主合同与拍品清单均已确认',
    disabledCondition: 'contractTableStatus 或 lotTableStatus 非 CONFIRMED 时按钮禁用',
    feedback: 'draftStatus → GENERATING，跳转草稿预览页',
    riskLevel: 'needConfirm',
    note: '前置：须先完成 P04、P05 确认动作回到工作台。',
  },
  {
    id: 'T-009',
    fromPageId: 'P04',
    fromPageName: '主合同确认',
    actionId: 'A-P04-001',
    actionLabel: '确认主合同信息',
    actionType: 'button',
    toPageId: 'P06',
    toPageName: 'AI 工作台（双表已确认）',
    condition: '用户完成表格内字段核对',
    disabledCondition: '无',
    feedback: 'contractTableStatus → CONFIRMED，返回工作台；若拍品亦已确认则出现 bothReady 提示',
    riskLevel: 'needConfirm',
    note: '若仅主合同确认而拍品未确认，工作台处于部分确认态（仍属 P03 索引态）。',
  },
  {
    id: 'T-010',
    fromPageId: 'P05',
    fromPageName: '拍品清单确认',
    actionId: 'A-P05-001',
    actionLabel: '确认拍品清单',
    actionType: 'button',
    toPageId: 'P06',
    toPageName: 'AI 工作台（双表已确认）',
    condition: '用户完成拍品行核对',
    disabledCondition: '无',
    feedback: 'lotTableStatus → CONFIRMED，返回工作台',
    riskLevel: 'needConfirm',
    note: '与 P04 对称；双表均确认后可执行 T-008。',
  },
  {
    id: 'T-011',
    fromPageId: 'P07',
    fromPageName: '草稿预览',
    actionId: 'A-P07-001',
    actionLabel: '返回工作台',
    actionType: 'button',
    toPageId: 'P08',
    toPageName: 'AI 工作台（草稿已生成）',
    condition: '草稿已生成完成（非 GENERATING）',
    disabledCondition: '生成中时不展示底部返回按钮',
    feedback: '返回 /demo，draftStatus 为 GENERATED，对话区可出现提交检查入口',
    riskLevel: 'normal',
    note: '页头「返回工作台」与底部「返回 AI 工作台」同路由。',
  },
  {
    id: 'T-012',
    fromPageId: 'P08',
    fromPageName: 'AI 工作台（草稿已生成）',
    actionId: 'A-P08-001',
    actionLabel: '提交审核检查',
    actionType: 'button',
    toPageId: 'P09',
    toPageName: '提交审核检查',
    condition: '草稿已生成且对话卡片展示提交入口',
    disabledCondition: '无',
    feedback: '进入提交审核检查页',
    riskLevel: 'normal',
    note: '由 completeDraftGeneration 后注入的 submitCheck 消息卡片触发。',
  },
  {
    id: 'T-013',
    fromPageId: 'P09',
    fromPageName: '提交审核检查',
    actionId: 'A-P09-001',
    actionLabel: '提交审核',
    actionType: 'button',
    toPageId: 'P09',
    toPageName: '提交审核检查',
    condition: '全部检查项通过（allPass）',
    disabledCondition: '存在未通过检查项时按钮禁用',
    feedback: 'alert 模拟提交成功，不真实调用接口',
    riskLevel: 'blocking',
    note: 'Demo 边界：仅提示，不离开页面。',
  },
  {
    id: 'T-014',
    fromPageId: 'P01',
    fromPageName: 'AI 工作台',
    actionId: 'A-P01-002',
    actionLabel: '上传客户证件',
    actionType: 'button',
    toPageId: 'P01',
    toPageName: 'AI 工作台',
    condition: '用户点击快捷按钮或上传卡片内入口',
    disabledCondition: '识别进行中时不可用',
    feedback: '浮层内展开客户证件上传区域',
    riskLevel: 'normal',
    note: '不跳转；与合同上传并列第三类确认任务的前置步骤。',
  },
  {
    id: 'T-015',
    fromPageId: 'P03',
    fromPageName: '识别结果',
    actionId: 'A-P10-002',
    actionLabel: '查看/确认客户',
    actionType: 'button',
    toPageId: 'P10',
    toPageName: '客户信息线上确认',
    condition: '识别已完成且客户索引卡片已展示',
    disabledCondition: '无',
    feedback: '进入客户信息线上确认页',
    riskLevel: 'normal',
    note: '客户确认后直接同步客户管理，不写入系统草稿。',
  },
  {
    id: 'T-016',
    fromPageId: 'P10',
    fromPageName: '客户信息线上确认',
    actionId: 'A-P10-001',
    actionLabel: '确认并创建/更新客户',
    actionType: 'button',
    toPageId: 'P10',
    toPageName: '客户信息线上确认',
    condition: '必填字段与证件/地址模块均完整',
    disabledCondition: '校验未通过时主按钮禁用',
    feedback: '模拟同步至客户管理页面并关联合同草稿',
    riskLevel: 'needConfirm',
    note: '逐条处理；完成后索引卡片状态同步。',
  },
];

export function getFlowPageById(pageId) {
  return flowPages.find((p) => p.id === pageId);
}

export function getFlowSpecById(id) {
  return flowSpec.find((t) => t.id === id);
}

export function getFlowSpecByActionId(actionId) {
  return flowSpec.find((t) => t.actionId === actionId);
}

export function getFlowSpecsByFromPage(fromPageId) {
  return flowSpec.filter((t) => t.fromPageId === fromPageId);
}

export function getFlowSpecsByToPage(toPageId) {
  return flowSpec.filter((t) => t.toPageId === toPageId);
}
