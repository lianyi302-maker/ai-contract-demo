import { FIELD_STATUS } from '../ui/constants';

export const mockFiles = [
  {
    id: 'f1',
    name: '主合同_嘉德2025春季.pdf',
    type: 'contract',
    size: '2.4 MB',
    uploadedAt: '2025-05-27 10:12',
  },
  {
    id: 'f2',
    name: '拍品清单_附件A.xlsx',
    type: 'lotList',
    size: '186 KB',
    uploadedAt: '2025-05-27 10:13',
  },
];

export const mockContractFields = [
  { key: 'partyA', label: '甲方', value: '中国嘉德国际拍卖有限公司', status: FIELD_STATUS.NORMAL },
  { key: 'partyB', label: '乙方', value: '张某某', status: FIELD_STATUS.NORMAL },
  { key: 'amount', label: '合同金额', value: '1,280,000.00', status: FIELD_STATUS.LOW_CONFIDENCE },
  { key: 'currency', label: '币种', value: 'CNY', status: FIELD_STATUS.NORMAL },
  { key: 'signDate', label: '签订日期', value: '', status: FIELD_STATUS.MISSING },
  { key: 'creditCode', label: '统一社会信用代码', value: '91110000XXXX', status: FIELD_STATUS.CONFLICT, hint: '与系统客户档案不一致' },
];

export const mockLotRows = [
  { id: 'L1', name: '清乾隆青花缠枝莲纹瓶', spec: '高32cm', qty: '1', unit: '件', estimate: '80,000', status: FIELD_STATUS.NORMAL },
  { id: 'L2', name: '民国粉彩花鸟纹盘', spec: '直径18cm', qty: '2', unit: '件', estimate: '', status: FIELD_STATUS.MISSING },
  { id: 'L3', name: '近现代山水画', spec: '68×45cm', qty: '1', unit: '幅', estimate: '120,000', status: FIELD_STATUS.LOW_CONFIDENCE },
];

export const mockDiffItems = [
  { field: '合同金额', before: '1,200,000.00', after: '1,280,000.00' },
  { field: '拍品 L2 估价', before: '—', after: '45,000' },
  { field: '乙方联系人', before: '李某某', after: '张某某' },
];

export const mockConfirmItems = [
  { id: 'c1', label: '主合同甲乙方与附件一致', required: true, checked: true },
  { id: 'c2', label: '拍品数量合计与清单附件一致', required: true, checked: false },
  { id: 'c3', label: '已确认推送至测试环境草稿', required: true, checked: false },
  { id: 'c4', label: '已阅读全部警告项', required: false, checked: true },
];

export const mockChatMessages = [
  { id: 'm1', role: 'user', content: '把第2件拍品估价改为 45000' },
  { id: 'm2', role: 'assistant', content: '已识别修改意图，将更新拍品 L2 的估价字段。请在下方面板确认 diff 后应用。' },
];

export const mockPromptExamples = [
  '将所有低置信度金额字段标红并列出',
  '把乙方联系人改为王某某',
  '根据主合同金额校验拍品估价合计',
  '生成补充协议：变更交付时间为30日内',
];

export const mockCommandResult = {
  title: '批量修改拍品估价',
  status: 'success',
  summary: '已匹配 1 条拍品记录，待您确认后应用。',
  changes: ['L2 估价：空 → 45,000'],
};

export const mockAgreementDraft = {
  title: '补充协议（草稿）',
  parties: '甲方：中国嘉德… / 乙方：张某某',
  clause: '双方约定原合同交付时间变更为签署后 30 个自然日内完成。',
  generatedAt: '2025-05-27 10:45',
};

export const mockAiCheckItems = {
  missing: [
    { id: 'miss1', label: '签订日期', scope: '主合同' },
    { id: 'miss2', label: '拍品 L2 估价', scope: '拍品清单' },
  ],
  errors: [
    { id: 'err1', label: '统一社会信用代码', detail: '与 CRM 客户档案不一致', scope: '主合同' },
  ],
};
