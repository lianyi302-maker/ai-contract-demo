/**
 * 大图页面地图 — 节点与连线（仅展示，不驱动业务）
 * 画布坐标系：4800 × 3200
 */
export const REAL_MAP_CANVAS = { width: 4800, height: 3200 };

/** @typedef {'iframe' | 'image'} PreviewType */

/**
 * @typedef {Object} RealMapNode
 * @property {string} id
 * @property {string} pageId P01–P09
 * @property {string} name
 * @property {string} stateLabel
 * @property {PreviewType} previewType
 * @property {string} previewSrc iframe src 或图片路径
 * @property {string} [openHref] 在新标签打开的完整页面
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/** @type {RealMapNode[]} */
export const realMapNodes = [
  {
    id: 'p09-init',
    pageId: 'P09',
    name: 'AI 工作台',
    stateLabel: '初始对话',
    previewType: 'iframe',
    previewSrc: '/embed/workbench-init',
    openHref: '/demo',
    x: 80,
    y: 100,
    width: 560,
    height: 380,
  },
  {
    id: 'p09-indexed',
    pageId: 'P09',
    name: 'AI 工作台',
    stateLabel: '识别完成 · 结果索引',
    previewType: 'iframe',
    previewSrc: '/embed/workbench-indexed',
    openHref: '/demo',
    x: 720,
    y: 100,
    width: 560,
    height: 380,
  },
  {
    id: 'p01-upload',
    pageId: 'P01',
    name: '上传材料',
    stateLabel: '待上传 / 已选文件',
    previewType: 'iframe',
    previewSrc: '/embed/upload-idle',
    openHref: '/demo/upload',
    x: 1360,
    y: 100,
    width: 560,
    height: 380,
  },
  {
    id: 'p02-recognizing',
    pageId: 'P02',
    name: 'AI 识别中',
    stateLabel: '识别进度中',
    previewType: 'iframe',
    previewSrc: '/embed/upload-recognizing',
    openHref: '/demo/upload',
    x: 2000,
    y: 100,
    width: 560,
    height: 380,
  },
  {
    id: 'p04-contract-pending',
    pageId: 'P04',
    name: '主合同线上表格',
    stateLabel: '待确认',
    previewType: 'iframe',
    previewSrc: '/embed/contract-pending',
    openHref: '/demo/contract-table',
    x: 200,
    y: 560,
    width: 600,
    height: 400,
  },
  {
    id: 'p04-contract-confirmed',
    pageId: 'P04',
    name: '主合同录入（系统）',
    stateLabel: '已确认 · 系统真实页',
    previewType: 'image',
    previewSrc: '/references/main-contract-page.png',
    openHref: '/demo/contract-table',
    x: 880,
    y: 560,
    width: 600,
    height: 400,
  },
  {
    id: 'p05-lot-pending',
    pageId: 'P05',
    name: '拍品清单线上表格',
    stateLabel: '待确认',
    previewType: 'iframe',
    previewSrc: '/embed/lot-pending',
    openHref: '/demo/lot-table',
    x: 1560,
    y: 560,
    width: 600,
    height: 400,
  },
  {
    id: 'p05-lot-confirmed',
    pageId: 'P05',
    name: '拍品清单（系统）',
    stateLabel: '已确认 · 系统真实页',
    previewType: 'image',
    previewSrc: '/references/lot-list-page.png',
    openHref: '/demo/lot-table',
    x: 2240,
    y: 560,
    width: 600,
    height: 400,
  },
  {
    id: 'p06-chat',
    pageId: 'P06',
    name: 'AI 对话修改',
    stateLabel: '工作台内对话（可选分支）',
    previewType: 'iframe',
    previewSrc: '/embed/workbench-indexed',
    openHref: '/demo',
    x: 2920,
    y: 560,
    width: 560,
    height: 400,
  },
  {
    id: 'p07-draft-gen',
    pageId: 'P07',
    name: '生成系统草稿',
    stateLabel: '生成中',
    previewType: 'iframe',
    previewSrc: '/embed/draft-generating',
    openHref: '/demo/draft-preview',
    x: 480,
    y: 1040,
    width: 600,
    height: 400,
  },
  {
    id: 'p07-draft-done',
    pageId: 'P07',
    name: '草稿预览',
    stateLabel: '已生成（主合同 + 拍品截图）',
    previewType: 'iframe',
    previewSrc: '/embed/draft-done',
    openHref: '/demo/draft-preview',
    x: 1160,
    y: 1040,
    width: 640,
    height: 420,
  },
  {
    id: 'p08-submit',
    pageId: 'P08',
    name: '提交审核检查',
    stateLabel: '校验清单',
    previewType: 'iframe',
    previewSrc: '/embed/submit-check',
    openHref: '/demo/submit-check',
    x: 1880,
    y: 1040,
    width: 600,
    height: 400,
  },
];

/** @type {{ from: string, to: string, label: string }[]} */
export const realMapLinks = [
  { from: 'p09-init', to: 'p01-upload', label: '上传材料' },
  { from: 'p01-upload', to: 'p02-recognizing', label: '开始识别' },
  { from: 'p02-recognizing', to: 'p09-indexed', label: '识别完成' },
  { from: 'p09-indexed', to: 'p04-contract-pending', label: '打开主合同表' },
  { from: 'p09-indexed', to: 'p05-lot-pending', label: '打开拍品表' },
  { from: 'p04-contract-pending', to: 'p04-contract-confirmed', label: '确认主合同' },
  { from: 'p05-lot-pending', to: 'p05-lot-confirmed', label: '确认拍品' },
  { from: 'p05-lot-pending', to: 'p06-chat', label: 'AI 对话修改（可选）' },
  { from: 'p06-chat', to: 'p05-lot-pending', label: '应用变更' },
  { from: 'p04-contract-confirmed', to: 'p07-draft-gen', label: '生成草稿' },
  { from: 'p05-lot-confirmed', to: 'p07-draft-gen', label: '生成草稿' },
  { from: 'p07-draft-gen', to: 'p07-draft-done', label: '生成完成' },
  { from: 'p07-draft-done', to: 'p08-submit', label: '提交审核检查' },
  { from: 'p08-submit', to: 'p04-contract-pending', label: '跳转修复' },
  { from: 'p08-submit', to: 'p05-lot-pending', label: '跳转修复' },
];

export function getRealMapNodeById(id) {
  return realMapNodes.find((n) => n.id === id);
}

export function getNodeCenter(node) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}
