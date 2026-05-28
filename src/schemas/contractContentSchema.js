import { FIELD_TYPE, SOURCE_TYPE, CONFIRM_LEVEL } from './shared';

/** 固定图录费阶梯 — 拍卖会场次类型（不可用户增删） */
export const CATALOG_FEE_TIERS = [
  { key: 'springAutumn', label: '春季/秋季拍卖会' },
  { key: 'fourSeasons', label: '四季拍卖会' },
  { key: 'online', label: '网络拍卖会' },
];

/**
 * 合同内容区 — 结构化 blocks，非平铺 fields
 */
export const contractContentSchema = {
  id: 'contractContent',
  parentSection: 'contractContent',
  label: '合同内容',
  version: '0.1.0',

  blocks: [
    {
      key: 'auctionType',
      label: '拍卖会/合同类型选择',
      component: 'AuctionTypeSelector',
      fields: [
        {
          key: 'auctionContractType',
          label: '合同类型',
          type: FIELD_TYPE.RADIO,
          required: true,
          aiExtractable: true,
          sourceType: SOURCE_TYPE.PAPER_CONTRACT,
          confirmLevel: CONFIRM_LEVEL.MUST_CONFIRM,
          options: [
            { value: 'general', label: '普通拍卖' },
            { value: 'judicial', label: '司法拍卖' },
            { value: 'asset', label: '资产拍卖' },
          ],
        },
        {
          key: 'categorySelection',
          label: '门类选择',
          type: FIELD_TYPE.SELECT,
          required: false,
          aiExtractable: true,
          sourceType: SOURCE_TYPE.PAPER_CONTRACT,
          confirmLevel: CONFIRM_LEVEL.NEED_CONFIRM,
          options: [],
          uncertain: true,
        },
        {
          key: 'auctionTimePlace',
          label: '时间/地点',
          type: FIELD_TYPE.TEXT,
          required: false,
          aiExtractable: true,
          sourceType: SOURCE_TYPE.PAPER_CONTRACT,
          confirmLevel: CONFIRM_LEVEL.NEED_CONFIRM,
          uncertain: true,
        },
      ],
    },
    {
      key: 'dealFeeRules',
      label: '成交费用规则',
      component: 'FeeRuleEditor',
      mode: 'deal',
      type: FIELD_TYPE.FEE_RULE,
      required: true,
      aiExtractable: true,
      sourceType: SOURCE_TYPE.PAPER_CONTRACT,
      confirmLevel: CONFIRM_LEVEL.MUST_CONFIRM,
      feeRuleConfig: {
        tiered: true,
        catalogFeeTiers: CATALOG_FEE_TIERS,
        allowUserAddTier: false,
        items: [
          {
            key: 'commission',
            label: '佣金',
            valueType: 'percent',
            tiered: false,
          },
          {
            key: 'insurance',
            label: '保险费',
            valueType: 'percent',
            tiered: false,
          },
          {
            key: 'catalogFee',
            label: '图录费',
            valueType: 'amount',
            tiered: true,
            tierKeys: CATALOG_FEE_TIERS.map((t) => t.key),
          },
        ],
      },
    },
    {
      key: 'noDealFeeRules',
      label: '未成交费用规则',
      component: 'FeeRuleEditor',
      mode: 'noDeal',
      type: FIELD_TYPE.FEE_RULE,
      required: true,
      aiExtractable: true,
      sourceType: SOURCE_TYPE.PAPER_CONTRACT,
      confirmLevel: CONFIRM_LEVEL.MUST_CONFIRM,
      feeRuleConfig: {
        tiered: false,
        items: [
          { key: 'insurance', label: '保险费', valueType: 'percent', tiered: false },
          { key: 'catalogFee', label: '图录费', valueType: 'amount', tiered: false },
          { key: 'unsoldFee', label: '流拍费', valueType: 'amount', tiered: false },
          { key: 'storageFee', label: '保管费', valueType: 'amount', tiered: false, uncertain: true },
        ],
      },
    },
    {
      key: 'otherFees',
      label: '其他费用',
      component: 'FeeRuleEditor',
      mode: 'other',
      type: FIELD_TYPE.FEE_RULE,
      required: false,
      aiExtractable: true,
      sourceType: SOURCE_TYPE.PAPER_CONTRACT,
      confirmLevel: CONFIRM_LEVEL.NEED_CONFIRM,
      feeRuleConfig: {
        tiered: false,
        items: [
          { key: 'appraisalFee', label: '评估费', valueType: 'amount', tiered: false },
          { key: 'packingFee', label: '包装费', valueType: 'amount', tiered: false },
          { key: 'shippingFee', label: '运输费', valueType: 'amount', tiered: false, uncertain: true },
          { key: 'otherFeesRemarks', label: '备注', valueType: 'text', tiered: false },
        ],
      },
    },
    {
      key: 'consignorDeclaration',
      label: '委托人声明',
      component: 'DeclarationRadio',
      fields: [
        {
          key: 'declarationStatus',
          label: '声明状态',
          type: FIELD_TYPE.RADIO,
          required: true,
          aiExtractable: true,
          sourceType: SOURCE_TYPE.PAPER_CONTRACT,
          confirmLevel: CONFIRM_LEVEL.MUST_CONFIRM,
          options: [
            { value: 'agree', label: '同意' },
            { value: 'partial', label: '部分同意' },
            { value: 'disagree', label: '不同意' },
          ],
          uncertain: true,
        },
      ],
    },
    {
      key: 'specialProvisions',
      label: '特别约定',
      component: 'ClauseEditor',
      type: FIELD_TYPE.CLAUSE,
      required: false,
      aiExtractable: true,
      sourceType: SOURCE_TYPE.PAPER_CONTRACT,
      confirmLevel: CONFIRM_LEVEL.MUST_CONFIRM,
    },
    {
      key: 'validityPeriod',
      label: '合同有效时间',
      component: 'DateRange',
      fields: [
        {
          key: 'validityStart',
          label: '生效日期',
          type: FIELD_TYPE.DATE,
          required: true,
          aiExtractable: true,
          sourceType: SOURCE_TYPE.PAPER_CONTRACT,
          confirmLevel: CONFIRM_LEVEL.MUST_CONFIRM,
        },
        {
          key: 'validityEnd',
          label: '失效日期',
          type: FIELD_TYPE.DATE,
          required: false,
          aiExtractable: true,
          sourceType: SOURCE_TYPE.PAPER_CONTRACT,
          confirmLevel: CONFIRM_LEVEL.NEED_CONFIRM,
        },
      ],
    },
  ],
};

export function getContentBlock(key) {
  return contractContentSchema.blocks.find((b) => b.key === key);
}
