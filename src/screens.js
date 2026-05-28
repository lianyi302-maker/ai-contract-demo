/**
 * 页面注册表 — 单一数据源
 * 后续逐页替换 UI 时，请保留字段结构，仅调整 path / nextScreens 等如有需要
 */
export const screens = [
  {
    id: 'P01',
    name: '上传材料',
    path: '/p01',
    goal: '用户上传主合同及拍品相关附件，作为 AI 识别输入。',
    mainActions: [
      '选择/拖拽上传主合同 PDF',
      '上传拍品清单附件（可选）',
      '查看已选文件列表',
      '开始识别',
    ],
    nextScreens: ['P02'],
    exceptions: [
      '文件格式不支持（仅 PDF/图片）',
      '单文件超过大小上限',
      '未上传主合同即点击开始',
      '网络上传失败',
    ],
    humanConfirmPoints: [
      '确认主合同文件正确、版本为最新',
      '确认附件与本次业务批次一致',
    ],
  },
  {
    id: 'P02',
    name: 'AI识别中',
    path: '/p02',
    goal: '展示识别进度，用户等待后台完成结构化抽取。',
    mainActions: [
      '查看识别阶段与进度条',
      '查看当前处理文档名称',
      '取消识别（返回上传）',
    ],
    nextScreens: ['P03', 'P01'],
    exceptions: [
      '识别超时',
      '服务端识别失败',
      '用户取消',
    ],
    humanConfirmPoints: [
      '无需确认，仅等待；失败时需人工决定是否重试',
    ],
  },
  {
    id: 'P03',
    name: '识别结果预览',
    path: '/p03',
    goal: '预览 AI 抽取的字段与表格片段，判断质量是否可进入确认流程。',
    mainActions: [
      '切换字段/表格预览 Tab',
      '高亮低置信度字段',
      '进入主合同确认',
      '重新识别',
    ],
    nextScreens: ['P04', 'P02', 'P01'],
    exceptions: [
      '关键字段全部为空',
      '预览数据加载失败',
    ],
    humanConfirmPoints: [
      '肉眼判断识别质量是否可用',
      '决定是否重新上传或重新识别',
    ],
  },
  {
    id: 'P04',
    name: '主合同信息确认',
    path: '/p04',
    goal: '核对并修正主合同关键信息（甲乙方、金额、日期等）。',
    mainActions: [
      '编辑表单字段',
      '标记字段为已核对',
      '保存草稿',
      '进入拍品清单确认',
    ],
    nextScreens: ['P05', 'P06', 'P03'],
    exceptions: [
      '必填项未填',
      '日期/金额格式校验失败',
      '保存失败',
    ],
    humanConfirmPoints: [
      '甲乙方名称与统一社会信用代码',
      '合同金额、币种、签订日期',
      '与业务系统已有客户信息是否一致',
    ],
  },
  {
    id: 'P05',
    name: '拍品清单确认',
    path: '/p05',
    goal: '核对拍品行项目（名称、规格、数量、估价等），支持增删改。',
    mainActions: [
      '表格内联编辑',
      '新增/删除行',
      '批量导入覆盖',
      '进入 AI 对话修改',
      '跳过对话直接进入导出',
    ],
    nextScreens: ['P06', 'P07', 'P04'],
    exceptions: [
      '行数为 0',
      '单行必填字段缺失',
      '导入文件解析失败',
    ],
    humanConfirmPoints: [
      '拍品名称与规格与附件一致',
      '数量、单位、估价合理',
      '合计与主合同金额逻辑一致（如有）',
    ],
  },
  {
    id: 'P06',
    name: 'AI对话修改面板',
    path: '/p06',
    goal: '通过自然语言让 AI 批量修改合同或拍品数据，并展示 diff 预览。',
    mainActions: [
      '输入修改指令',
      '发送并查看 AI 回复',
      '预览变更 diff',
      '应用变更 / 撤销',
      '继续前往导出',
    ],
    nextScreens: ['P07', 'P05', 'P04'],
    exceptions: [
      'AI 无法理解指令',
      '应用变更后校验失败',
      '会话超时',
    ],
    humanConfirmPoints: [
      '应用前必须确认 diff 内容',
      '敏感字段（金额、主体）变更需二次确认',
    ],
  },
  {
    id: 'P07',
    name: '导出Excel/更新系统草稿',
    path: '/p07',
    goal: '生成 Excel 并/或推送至业务系统草稿，供线下或系统内继续流转。',
    mainActions: [
      '选择导出模板',
      '下载 Excel',
      '推送到业务系统草稿',
      '查看推送结果',
      '进入提交前检查',
    ],
    nextScreens: ['P08', 'P06', 'P05'],
    exceptions: [
      '导出模板缺失',
      '推送 API 失败',
      '业务系统返回业务错误码',
    ],
    humanConfirmPoints: [
      '确认目标系统与环境（测试/生产）',
      '确认草稿接收方与单据类型',
    ],
  },
  {
    id: 'P08',
    name: '提交前检查',
    path: '/p08',
    goal: '汇总校验结果与人工核对项，通过后方可正式提交。',
    mainActions: [
      '查看校验清单（通过/警告/错误）',
      '跳转修复对应页面',
      '填写提交备注',
      '正式提交',
      '返回修改',
    ],
    nextScreens: ['P04', 'P05', 'P07', 'P01'],
    exceptions: [
      '存在阻断级校验错误',
      '提交接口失败',
      '重复提交',
    ],
    humanConfirmPoints: [
      '全部阻断项已处理',
      '已阅读并确认警告项',
      '提交人身份与权限符合规范',
    ],
  },
];

/** 按 id 查找 */
export function getScreenById(id) {
  return screens.find((s) => s.id === id);
}

/** 按 path 查找 */
export function getScreenByPath(path) {
  return screens.find((s) => s.path === path);
}

/** 解析 nextScreens id 列表为完整 screen 对象 */
export function resolveNextScreens(screen) {
  return (screen.nextScreens || [])
    .map((id) => getScreenById(id))
    .filter(Boolean);
}
