import { lotColumnsSchema } from '../../schemas/lotColumnsSchema';
import { FIELD_TYPE } from '../../schemas/shared';
import OnlineDataTable from './OnlineDataTable';

/** 拍品线上表格列 — 排除勾选/序号/审核状态，保留合同编号等 */
const lotOnlineColumns = lotColumnsSchema.columns
  .filter(
    (c) =>
      !['selected', 'rowIndex', 'auditStatus'].includes(c.key) &&
      c.type !== FIELD_TYPE.ACTION &&
      c.type !== FIELD_TYPE.STATUS
  )
  .map((c) => ({
    key: c.key,
    label: c.label,
    type: c.type === FIELD_TYPE.SELECT ? 'select' : c.type === FIELD_TYPE.MONEY ? 'text' : 'text',
    required: c.required,
    width: c.width,
    options: c.options,
  }));

export default function LotOnlineTable(props) {
  return (
    <OnlineDataTable title="拍品清单线上表格" columns={lotOnlineColumns} {...props} />
  );
}
