import { FIELD_STATUS } from '../ui/constants';
import { lotListDraft } from '../mock/lotListDraft';
import { initialCustomerUploadGroups } from '../mock/mockCustomers';

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
  WRITTEN: 'written',
};

export const DRAFT_STATUS = {
  NONE: 'none',
  GENERATING: 'generating',
  GENERATED: 'generated',
};

export const SUBMIT_STATUS = {
  IDLE: 'idle',
  CHECKED: 'checked',
  SUBMITTED: 'submitted',
};

export const CUSTOMER_TYPE = {
  PERSONAL: 'personal',
  ENTERPRISE: 'enterprise',
};

export const CUSTOMER_SOURCE = {
  ID_CARD: 'idCard',
  CONTRACT: 'contract',
  BUSINESS_LICENSE: 'businessLicense',
};

export const CUSTOMER_STATUS = {
  PENDING: 'pending',
  MISSING: 'missing',
  READY: 'ready',
  CREATED: 'created',
  UPDATED: 'updated',
};

export const CUSTOMER_SOURCE_LABEL = {
  [CUSTOMER_SOURCE.ID_CARD]: '身份证识别',
  [CUSTOMER_SOURCE.CONTRACT]: '合同识别',
  [CUSTOMER_SOURCE.BUSINESS_LICENSE]: '营业执照识别',
};

export const CUSTOMER_STATUS_LABEL = {
  [CUSTOMER_STATUS.PENDING]: '待确认',
  [CUSTOMER_STATUS.MISSING]: '信息缺失',
  [CUSTOMER_STATUS.READY]: '可创建',
  [CUSTOMER_STATUS.CREATED]: '已创建',
  [CUSTOMER_STATUS.UPDATED]: '已更新',
};

export const CUSTOMER_TYPE_LABEL = {
  [CUSTOMER_TYPE.PERSONAL]: '个人客户',
  [CUSTOMER_TYPE.ENTERPRISE]: '企业客户',
};

export const CUSTOMER_TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

/** 识别入口：仅客户证件 / 合同与拍品 */
export const RECOGNITION_INPUT = {
  CUSTOMER: 'customer',
  CONTRACT: 'contract',
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
  { key: 'customer', label: '正在识别客户信息' },
  { key: 'match', label: '正在匹配合同编号' },
  { key: 'table', label: '正在生成线上表格' },
];

/** 仅上传客户证件时的识别进度（不含主合同 / 拍品） */
export const customerRecognitionSteps = [
  { key: 'customerDocs', label: '正在识别客户证件' },
  { key: 'customer', label: '正在识别客户信息' },
  { key: 'customerConfirm', label: '正在生成客户确认任务' },
];

export const submitCheckSteps = [
  { key: 'fields', label: '校验字段完整性' },
  { key: 'draft', label: '校验草稿内容' },
  { key: 'summary', label: '生成审核摘要' },
];

export function computeCustomerRecognitionStats(customers = []) {
  const total = customers.length;
  const individual = customers.filter((c) => c.customerType === CUSTOMER_TYPE.PERSONAL).length;
  const enterprise = customers.filter((c) => c.customerType === CUSTOMER_TYPE.ENTERPRISE).length;
  const missing = customers.filter((c) => c.status === CUSTOMER_STATUS.MISSING).length;
  const pendingConfirm = customers.filter((c) =>
    [CUSTOMER_STATUS.PENDING, CUSTOMER_STATUS.MISSING, CUSTOMER_STATUS.READY].includes(c.status)
  ).length;
  return { total, individual, enterprise, missing, pendingConfirm };
}

export function computeRecognitionSummary(contractRows, lotRows, customers = []) {
  const customerStats = computeCustomerRecognitionStats(customers);
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
    customerCount: customerStats.total,
    customerIndividual: customerStats.individual,
    customerEnterprise: customerStats.enterprise,
    customerMissing: customerStats.missing,
    customerPendingConfirm: customerStats.pendingConfirm,
  };
}

export function computeCustomerSummary(customers = []) {
  const total = customers.length;
  const personalCount = customers.filter((c) => c.customerType === CUSTOMER_TYPE.PERSONAL).length;
  const enterpriseCount = customers.filter((c) => c.customerType === CUSTOMER_TYPE.ENTERPRISE).length;
  const missingCount = customers.filter(
    (c) => c.status === CUSTOMER_STATUS.MISSING
  ).length;
  const pendingCount = customers.filter(
    (c) => [CUSTOMER_STATUS.PENDING, CUSTOMER_STATUS.MISSING, CUSTOMER_STATUS.READY].includes(c.status)
  ).length;
  const createdCount = customers.filter((c) => c.status === CUSTOMER_STATUS.CREATED).length;
  const updatedCount = customers.filter((c) => c.status === CUSTOMER_STATUS.UPDATED).length;
  const completedCount = createdCount + updatedCount;

  return {
    customerCount: total,
    personalCount,
    enterpriseCount,
    customerMissingCount: missingCount,
    customerPendingCount: pendingCount,
    customerCreatedCount: createdCount,
    customerUpdatedCount: updatedCount,
    customerCompletedCount: completedCount,
  };
}

export function computeCustomerTaskStatus(customers = []) {
  if (!customers.length) return CUSTOMER_TASK_STATUS.PENDING;
  const allDone = customers.every((c) =>
    [CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(c.status)
  );
  if (allDone) return CUSTOMER_TASK_STATUS.COMPLETED;
  const anyDone = customers.some((c) =>
    [CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(c.status)
  );
  if (anyDone) return CUSTOMER_TASK_STATUS.IN_PROGRESS;
  return CUSTOMER_TASK_STATUS.PENDING;
}

export function computeRecognitionSummaryWithCustomers(contractRows, lotRows, customers) {
  return {
    ...computeRecognitionSummary(contractRows, lotRows, customers),
    ...computeCustomerSummary(customers),
  };
}

export function createInitialDemoFlowState() {
  return {
    uploadStatus: UPLOAD_STATUS.IDLE,
    recognitionStatus: RECOGNITION_STATUS.IDLE,
    contractTableStatus: TABLE_STATUS.PENDING,
    lotTableStatus: TABLE_STATUS.PENDING,
    draftStatus: DRAFT_STATUS.NONE,
    contractSubmitStatus: SUBMIT_STATUS.IDLE,
    lotSubmitStatus: SUBMIT_STATUS.IDLE,
    submitCheckStatus: 'idle',
    customerUploadGroups: structuredClone(initialCustomerUploadGroups),
    customerUploadDone: false,
    mockCustomers: [],
    customerTaskStatus: CUSTOMER_TASK_STATUS.PENDING,
    selectedCustomerId: null,
    recognitionInput: null,
    chatMessages: structuredClone(initialChatMessages),
    mockContractRows: structuredClone(mockContractRows),
    mockLotRows: structuredClone(mockLotRows),
    recognitionSummary: null,
    uploadedFiles: [],
    recognitionProgress: 0,
    currentRecognitionStep: 0,
  };
}

export function getSubmitCheckMetrics(state) {
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

  const contractTableReady =
    state.contractTableStatus === TABLE_STATUS.CONFIRMED ||
    state.contractTableStatus === TABLE_STATUS.WRITTEN;
  const lotTableReady =
    state.lotTableStatus === TABLE_STATUS.CONFIRMED ||
    state.lotTableStatus === TABLE_STATUS.WRITTEN;
  const draftOk =
    state.contractTableStatus === TABLE_STATUS.WRITTEN &&
    state.lotTableStatus === TABLE_STATUS.WRITTEN;

  return {
    summary,
    lotContractIssues,
    amountUnconfirmed,
    contractTableReady,
    lotTableReady,
    draftOk,
  };
}

export function buildSubmitCheckItemsForSection(section, state) {
  const {
    summary,
    lotContractIssues,
    amountUnconfirmed,
    contractTableReady,
    lotTableReady,
  } = getSubmitCheckMetrics(state);

  if (section === 'contract') {
    return [
      {
        id: 'contractComplete',
        label: '主合同字段是否完整',
        pass: contractTableReady && summary.missing < 3,
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
        id: 'contractDraft',
        label: '主合同内容是否已写入系统草稿',
        pass: state.contractTableStatus === TABLE_STATUS.WRITTEN,
      },
    ];
  }

  return [
    {
      id: 'lotBound',
      label: '拍品清单是否全部绑定合同编号',
      pass: lotContractIssues === 0,
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
      id: 'lotDraft',
      label: '拍品内容是否已写入系统草稿',
      pass: state.lotTableStatus === TABLE_STATUS.WRITTEN,
    },
  ];
}

export function buildSubmitCheckItems(state) {
  const {
    summary,
    lotContractIssues,
    amountUnconfirmed,
    contractTableReady,
    lotTableReady,
    draftOk,
  } = getSubmitCheckMetrics(state);

  return [
    {
      id: 'contractComplete',
      label: '主合同字段是否完整',
      pass: contractTableReady && summary.missing < 3,
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
      label: '主合同与拍品内容是否均已写入系统草稿',
      pass: draftOk,
    },
  ];
}

export function getCustomerUploadStatusText(group) {
  if (group.customerType === CUSTOMER_TYPE.PERSONAL) {
    const front = group.uploads.front?.uploaded;
    const back = group.uploads.back?.uploaded;
    if (front && back) return '证件正反面已上传';
    if (front && !back) return '缺少证件反面';
    if (!front && back) return '缺少证件正面';
    return '尚未上传证件';
  }
  const license = group.uploads.license?.uploaded;
  const supplement = group.uploads.supplement?.uploaded;
  const parts = [];
  parts.push(license ? '营业执照已上传' : '营业执照未上传');
  parts.push(supplement ? '补充资料已上传' : '补充资料未上传');
  return parts.join(' · ');
}

export function validateCustomerRecord(customer) {
  const errors = [];
  const { account, personal, idDocument, address } = customer;

  if (!account.mobilePhone?.trim() && !account.email?.trim()) {
    errors.push('请填写手机号或邮箱至少一项。');
  }

  if (!personal.chineseName?.trim()) errors.push('中文姓名为必填项');
  if (customer.customerType === CUSTOMER_TYPE.PERSONAL) {
    if (!personal.gender) errors.push('性别为必填项');
    if (!personal.nationality) errors.push('国籍为必填项');
    if (!idDocument.idType) errors.push('证件类型为必填项');
    if (!idDocument.idNumber?.trim()) errors.push('证件号码为必填项');
    if (!idDocument.idStatus) errors.push('证件状态为必填项');
    if (!address.province || !address.city || !address.district) {
      errors.push('地址省/市/区为必填项');
    }
    if (!address.detailAddress?.trim()) errors.push('详细地址为必填项');
    if (!address.zipCode?.trim()) errors.push('邮编为必填项');
    if (!address.addressType) errors.push('地址类型为必填项');
    if (!address.mailMethod) errors.push('邮寄方式为必填项');
  }

  if (customer.source === CUSTOMER_SOURCE.ID_CARD) {
    if (!idDocument.frontPhoto?.uploaded) errors.push('证件正面缺失');
    if (!idDocument.backPhoto?.uploaded) {
      errors.push('证件背面缺失，有效期未识别，请补充上传后继续确认。');
    }
    if (!idDocument.validUntil?.trim()) errors.push('证件有效期未识别');
  }

  if (address.autoFilledFromId && !address.confirmed) {
    errors.push('请确认证件地址是否作为邮寄地址使用');
  }

  return { valid: errors.length === 0, errors };
}

export function computeCustomerPageStats(customers = []) {
  const total = customers.length;
  const pending = customers.filter((c) => c.status === CUSTOMER_STATUS.PENDING).length;
  const missing = customers.filter((c) => c.status === CUSTOMER_STATUS.MISSING).length;
  const completed = customers.filter((c) =>
    [CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(c.status)
  ).length;
  return { total, pending, missing, completed };
}
