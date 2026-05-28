import { FIELD_STATUS } from '../ui/constants';
import { lotListDraft } from '../mock/lotListDraft';

const cell = (value, status = FIELD_STATUS.NORMAL, extra = {}) => ({
  value,
  status,
  ...extra,
});

export const UPLOAD_STATUS = {
  IDLE: 'idle',
  READY: 'ready',
  DONE: 'done',
};

export const RECOGNITION_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  DONE: 'done',
};

export const TABLE_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
};

export const DRAFT_STATUS = {
  NONE: 'none',
  GENERATING: 'generating',
  GENERATED: 'generated',
};

export const initialChatMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    type: 'text',
    content:
      '您好，我是 AI 合同录入助手。您可以让我帮您录入纸质主合同和拍品清单，并生成系统草稿。',
  },
];

export const mockContractRows = [
  {
    id: 'C1',
    selected: false,
    cells: {
      contractNo: cell('CN-2025-SPR-00821', FIELD_STATUS.NORMAL),
      contractType: cell('consignment', FIELD_STATUS.NORMAL),
      signStatus: cell('unsigned', FIELD_STATUS.NORMAL),
      department: cell('dep-01', FIELD_STATUS.NORMAL),
      handler: cell('user-wang', FIELD_STATUS.NORMAL),
      agent: cell('', FIELD_STATUS.MISSING),
      currency: cell('CNY', FIELD_STATUS.LOW_CONFIDENCE),
      taxRate: cell('6%', FIELD_STATUS.NORMAL),
      consignorName: cell('张某某', FIELD_STATUS.MUST_CONFIRM),
      idNumber: cell('110101199001011234', FIELD_STATUS.CONFLICT, {
        hint: '与 CRM 不一致',
        systemValue: '110101199002021234',
      }),
      mobilePhone: cell('13800138000', FIELD_STATUS.NORMAL),
      bankAccountName: cell('张某某', FIELD_STATUS.NORMAL),
      bankAccountNo: cell('6222021234567890', FIELD_STATUS.NORMAL),
    },
  },
  {
    id: 'C2',
    selected: false,
    cells: {
      contractNo: cell('CN-2025-SPR-00822', FIELD_STATUS.NORMAL),
      contractType: cell('consignment', FIELD_STATUS.NORMAL),
      signStatus: cell('signed', FIELD_STATUS.NORMAL),
      department: cell('dep-02', FIELD_STATUS.NORMAL),
      handler: cell('user-li', FIELD_STATUS.NORMAL),
      agent: cell('agent-01', FIELD_STATUS.NORMAL),
      currency: cell('CNY', FIELD_STATUS.NORMAL),
      taxRate: cell('6%', FIELD_STATUS.NORMAL),
      consignorName: cell('李某某', FIELD_STATUS.NORMAL),
      idNumber: cell('310101198505051234', FIELD_STATUS.NORMAL),
      mobilePhone: cell('13900139000', FIELD_STATUS.NORMAL),
      bankAccountName: cell('李某某', FIELD_STATUS.NORMAL),
      bankAccountNo: cell('6222029876543210', FIELD_STATUS.NORMAL),
    },
  },
];

export const mockLotRows = structuredClone(lotListDraft.lots);

export const recognitionSteps = [
  { key: 'contract', label: '正在识别主合同' },
  { key: 'lotList', label: '正在识别拍品清单' },
  { key: 'match', label: '正在匹配合同编号' },
  { key: 'table', label: '正在生成线上表格' },
];

export function computeRecognitionSummary(contractRows, lotRows) {
  let missing = 0;
  let lowConfidence = 0;
  let contractNoIssues = 0;
  const contractNos = new Set(
    contractRows.map((r) => r.cells.contractNo?.value).filter(Boolean)
  );

  const scan = (cells) => {
    Object.values(cells).forEach((c) => {
      if (!c || typeof c !== 'object') return;
      if (c.status === FIELD_STATUS.MISSING) missing += 1;
      if (c.status === FIELD_STATUS.LOW_CONFIDENCE) lowConfidence += 1;
    });
  };

  contractRows.forEach((r) => scan(r.cells));
  lotRows.forEach((r) => {
    scan(r.cells);
    const cn = r.cells.contractNo;
    if (
      !cn?.value ||
      cn.status === FIELD_STATUS.MISSING ||
      cn.status === FIELD_STATUS.LOW_CONFIDENCE ||
      cn.status === FIELD_STATUS.CONFLICT ||
      (cn.value && !contractNos.has(cn.value))
    ) {
      contractNoIssues += 1;
    }
  });

  return {
    contractCount: contractRows.length,
    lotCount: lotRows.length,
    missing,
    lowConfidence,
    contractNoIssues,
  };
}

export function createInitialDemoFlowState() {
  return {
    uploadStatus: UPLOAD_STATUS.IDLE,
    recognitionStatus: RECOGNITION_STATUS.IDLE,
    contractTableStatus: TABLE_STATUS.PENDING,
    lotTableStatus: TABLE_STATUS.PENDING,
    draftStatus: DRAFT_STATUS.NONE,
    submitCheckStatus: 'idle',
    chatMessages: structuredClone(initialChatMessages),
    mockContractRows: structuredClone(mockContractRows),
    mockLotRows: structuredClone(mockLotRows),
    recognitionSummary: null,
    uploadedFiles: [],
    recognitionProgress: 0,
    currentRecognitionStep: 0,
  };
}

export function buildSubmitCheckItems(state) {
  const summary = state.recognitionSummary || computeRecognitionSummary(
    state.mockContractRows,
    state.mockLotRows
  );
  const contractNos = new Set(
    state.mockContractRows.map((r) => r.cells.contractNo?.value).filter(Boolean)
  );
  let lotContractIssues = 0;
  let amountUnconfirmed = 0;
  state.mockLotRows.forEach((r) => {
    const cn = r.cells.contractNo;
    if (
      !cn?.value ||
      cn.status === FIELD_STATUS.CONFLICT ||
      cn.status === FIELD_STATUS.MISSING ||
      !contractNos.has(cn.value)
    ) {
      lotContractIssues += 1;
    }
    if (
      r.cells.reservePrice?.status === FIELD_STATUS.MUST_CONFIRM ||
      r.cells.reservePrice?.status === FIELD_STATUS.LOW_CONFIDENCE
    ) {
      amountUnconfirmed += 1;
    }
  });

  const contractComplete = state.contractTableStatus === TABLE_STATUS.CONFIRMED;
  const lotComplete = state.lotTableStatus === TABLE_STATUS.CONFIRMED;
  const draftOk = state.draftStatus === DRAFT_STATUS.GENERATED;

  return [
    {
      id: 'contractComplete',
      label: '主合同字段是否完整',
      pass: contractComplete && summary.missing < 3,
    },
    {
      id: 'lotBound',
      label: '拍品清单是否全部绑定合同编号',
      pass: lotContractIssues === 0,
    },
    {
      id: 'noMissing',
      label: '是否存在缺失字段',
      pass: summary.missing === 0,
    },
    {
      id: 'noLow',
      label: '是否存在低置信度字段',
      pass: summary.lowConfidence === 0,
    },
    {
      id: 'noConflict',
      label: '是否存在合同编号冲突',
      pass: summary.contractNoIssues === 0 && lotContractIssues === 0,
    },
    {
      id: 'amountConfirmed',
      label: '金额类字段是否人工确认',
      pass: amountUnconfirmed === 0,
    },
    {
      id: 'draftGenerated',
      label: '合同草稿和拍品清单是否均已生成',
      pass: draftOk,
    },
  ];
}
