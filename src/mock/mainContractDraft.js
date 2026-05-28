import { FIELD_STATUS } from '../ui/constants';
import { CONSIGNOR_TYPE } from '../schemas/shared';

/** P04 主合同 Tab — mock draftData */
export const mainContractDraft = {
  meta: {
    taskId: 'task-demo-001',
    schemaVersion: '0.1.0',
    activeTab: 'mainContract',
    pageId: 'P04',
  },
  basicInfo: {
    contractType: {
      value: 'consignment',
      status: FIELD_STATUS.NORMAL,
      source: 'paperContract',
    },
    contractNo: {
      value: 'CN-2025-SPR-00821',
      status: FIELD_STATUS.SYSTEM_GENERATED,
      source: 'systemDefault',
    },
    signStatus: {
      value: 'unsigned',
      status: FIELD_STATUS.NORMAL,
      source: 'systemDefault',
    },
    department: {
      value: 'dep-01',
      status: FIELD_STATUS.NORMAL,
      source: 'systemDefault',
    },
    handler: {
      value: 'user-wang',
      status: FIELD_STATUS.NORMAL,
      source: 'systemDefault',
    },
    agent: {
      value: '',
      status: FIELD_STATUS.MISSING,
      source: 'systemDefault',
    },
    currency: {
      value: 'CNY',
      status: FIELD_STATUS.LOW_CONFIDENCE,
      source: 'paperContract',
    },
    taxRate: {
      value: '6%',
      status: FIELD_STATUS.NORMAL,
      source: 'paperContract',
    },
    standardCatalog: {
      value: 'standard',
      status: FIELD_STATUS.NORMAL,
      source: 'ruleConfig',
    },
  },
  consignorInfo: {
    consignorType: {
      value: CONSIGNOR_TYPE.PERSONAL,
      status: FIELD_STATUS.NORMAL,
    },
    consignorName: {
      value: '张某某',
      status: FIELD_STATUS.MUST_CONFIRM,
      source: 'paperContract',
    },
    idType: { value: 'idCard', status: FIELD_STATUS.NORMAL },
    idNumber: {
      value: '110101199001011234',
      status: FIELD_STATUS.CONFLICT,
      hint: '与 CRM 客户档案证件号不一致',
      source: 'paperContract',
      systemValue: '110101199002021234',
    },
    dateOfBirth: { value: '1990-01-01', status: FIELD_STATUS.LOW_CONFIDENCE },
    gender: { value: 'male', status: FIELD_STATUS.NORMAL },
    mobilePhone: { value: '13800138000', status: FIELD_STATUS.NORMAL },
    address: { value: '北京市东城区某某街道1号', status: FIELD_STATUS.NORMAL },
    zipCode: { value: '100010', status: FIELD_STATUS.NORMAL },
    idPhotos: {
      value: [
        { id: 'id1', name: '身份证正面.jpg' },
        { id: 'id2', name: '身份证反面.jpg' },
      ],
      status: FIELD_STATUS.NORMAL,
    },
    bankAccountName: {
      value: '张某某',
      status: FIELD_STATUS.NORMAL,
    },
    bankAccountNo: {
      value: '6222021234567890',
      status: FIELD_STATUS.MODIFIED,
      hint: '已人工修改',
    },
    bankName: { value: '中国工商银行', status: FIELD_STATUS.NORMAL },
    bankBranch: { value: '东城支行', status: FIELD_STATUS.NORMAL },
    consignorRemarks: { value: '', status: FIELD_STATUS.NORMAL },
  },
  contractContent: {
    auctionType: {
      fields: {
        auctionContractType: { value: 'general', status: FIELD_STATUS.NORMAL },
        categorySelection: { value: '', status: FIELD_STATUS.MISSING },
        auctionTimePlace: { value: '2025年春季拍卖会 北京', status: FIELD_STATUS.LOW_CONFIDENCE },
      },
    },
    dealFeeRules: {
      status: FIELD_STATUS.MUST_CONFIRM,
      value: {
        commission: { value: '15', unit: '%' },
        insurance: { value: '1', unit: '%' },
        catalogFee: {
          tiers: {
            springAutumn: '300',
            fourSeasons: '500',
            online: '200',
          },
        },
      },
    },
    noDealFeeRules: {
      status: FIELD_STATUS.NORMAL,
      value: {
        insurance: { value: '1', unit: '%' },
        catalogFee: { value: '300', unit: 'CNY' },
        unsoldFee: { value: '0', unit: 'CNY' },
        storageFee: { value: '', unit: 'CNY' },
      },
    },
    otherFees: {
      status: FIELD_STATUS.NORMAL,
      value: {
        appraisalFee: { value: '' },
        packingFee: { value: '' },
        shippingFee: { value: '' },
        otherFeesRemarks: { value: '' },
      },
    },
    consignorDeclaration: {
      declarationStatus: { value: 'agree', status: FIELD_STATUS.NORMAL },
    },
    specialProvisions: {
      status: FIELD_STATUS.MUST_CONFIRM,
      value: {
        clauses: [
          {
            id: 'c1',
            text: '第4条：交付时间为签署后',
            inlineFields: [{ key: 'days', label: '天数', value: '30' }],
          },
          {
            id: 'c2',
            text: '第7条：保险费用由委托人承担。',
            inlineFields: [],
          },
        ],
      },
    },
    validityPeriod: {
      fields: {
        validityStart: { value: '2025-03-01', status: FIELD_STATUS.NORMAL },
        validityEnd: { value: '2026-02-28', status: FIELD_STATUS.NORMAL },
      },
    },
  },
  contractPhotos: {
    contractScans: {
      value: [
        { id: 's1', name: '合同首页.pdf' },
        { id: 's2', name: '合同签章页.pdf' },
      ],
      status: FIELD_STATUS.NORMAL,
    },
  },
};

export const mockLotDraftRows = [
  {
    id: 'L1',
    lotNo: '1001',
    name: '清乾隆青花缠枝莲纹瓶',
    author: '',
    spec: '高32cm',
    qty: '1',
    unit: '件',
    estimate: '80000',
    status: FIELD_STATUS.NORMAL,
  },
  {
    id: 'L2',
    lotNo: '1002',
    name: '民国粉彩花鸟纹盘',
    author: '',
    spec: '直径18cm',
    qty: '2',
    unit: '件',
    estimate: '',
    estimateStatus: FIELD_STATUS.MISSING,
    status: FIELD_STATUS.MISSING,
  },
  {
    id: 'L3',
    lotNo: '1003',
    name: '近现代山水画',
    author: '齐白石',
    spec: '68×45cm',
    qty: '1',
    unit: '幅',
    estimate: '120000',
    estimateStatus: FIELD_STATUS.CONFLICT,
    status: FIELD_STATUS.CONFLICT,
  },
];
