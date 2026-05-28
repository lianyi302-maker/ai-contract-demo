import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import ContractOnlineTable from '../components/ContractOnlineTable';

export default function ContractOnlineTablePage() {
  const navigate = useNavigate();
  const { state, setContractRows, confirmContractTable } = useDemoFlow();

  return (
    <div className="demo-page">
      <PageHeader
        title="主合同线上表格确认"
        description="批量确认 AI 提取的主合同字段 · 列来自 mainContractSchema"
        actions={[{ label: '返回工作台', onClick: () => navigate('/demo') }]}
      />
      <ContractOnlineTable
        rows={state.mockContractRows}
        onRowsChange={setContractRows}
      />
      <div className="demo-page__footer">
        <Button type="button" variant="default" onClick={() => navigate('/demo')}>
          取消
        </Button>
        <Button
          type="button"
          variant="primary"
          data-flow-action="A-P04-001"
          onClick={() => {
            confirmContractTable();
            navigate('/demo');
          }}
        >
          确认主合同信息
        </Button>
      </div>
    </div>
  );
}
