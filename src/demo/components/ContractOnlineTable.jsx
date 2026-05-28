import { contractOnlineColumnsSchema } from '../../schemas/contractOnlineColumnsSchema';
import OnlineDataTable from './OnlineDataTable';

export default function ContractOnlineTable(props) {
  return (
    <OnlineDataTable
      title="主合同线上表格"
      columns={contractOnlineColumnsSchema.columns}
      {...props}
    />
  );
}
