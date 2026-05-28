/**
 * 合同录入 — 顶部业务 Tab
 */
export const contractTabs = [
  {
    key: 'mainContract',
    label: '主合同',
    order: 1,
    schemaRef: 'mainContractSchema',
    contentSchemaRef: 'contractContentSchema',
    actionBarKey: 'mainContract',
  },
  {
    key: 'lotList',
    label: '拍品清单',
    order: 2,
    schemaRef: 'lotListSchema',
    columnsSchemaRef: 'lotColumnsSchema',
    statusSchemaRef: 'lotStatusSchema',
    actionBarKey: 'lotList',
  },
  {
    key: 'supplementary',
    label: '补充协议',
    order: 3,
    schemaRef: null,
    actionBarKey: null,
    disabled: true,
    note: '第一版占位，后续扩展',
  },
];

export function getContractTab(key) {
  return contractTabs.find((t) => t.key === key);
}
