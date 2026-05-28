import { mainContractSchema } from './mainContractSchema';
import { FIELD_TYPE } from './shared';

/** 主合同线上表格列 — 从 mainContractSchema 抽取批量确认用字段 */
const ONLINE_KEYS = [
  'contractNo',
  'contractType',
  'signStatus',
  'department',
  'handler',
  'agent',
  'currency',
  'taxRate',
  'consignorName',
  'idNumber',
  'mobilePhone',
  'bankAccountName',
  'bankAccountNo',
];

export const contractOnlineColumnsSchema = {
  id: 'contractOnlineColumns',
  version: '0.1.0',
  columns: mainContractSchema.fields
    .filter((f) => ONLINE_KEYS.includes(f.key))
    .map((f) => ({
      key: f.key,
      label: f.label,
      type: f.type === FIELD_TYPE.SELECT ? 'select' : 'text',
      required: f.required,
      editable: true,
      options: f.options,
    })),
};
