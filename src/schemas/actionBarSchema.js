/**
 * 页面级底部操作 — 不进入 field schema
 * Prototype 流程演示使用 prototypeFlow，不含在真实业务页
 */
export const actionBarSchema = {
  mainContract: {
    pageKey: 'mainContract',
    label: '主合同页',
    actions: [
      { key: 'save', label: '保存', variant: 'default', primary: false },
      {
        key: 'submitReview',
        label: '主合同审核 / 提交审核',
        variant: 'primary',
        primary: true,
      },
    ],
  },
  lotList: {
    pageKey: 'lotList',
    label: '拍品清单页',
    actions: [
      { key: 'save', label: '保存', variant: 'default', primary: false },
      { key: 'submitLotReview', label: '拍品提交审核', variant: 'primary', primary: true },
    ],
  },
  /** 仅 Prototype View 流程演示 */
  prototypeFlow: {
    pageKey: 'prototypeFlow',
    label: '原型流程演示',
    actions: [
      { key: 'back', label: '上一步', variant: 'default', primary: false },
      { key: 'next', label: '下一步', variant: 'primary', primary: true },
    ],
  },
};

export function getActionBarConfig(pageKey) {
  return actionBarSchema[pageKey] ?? null;
}
