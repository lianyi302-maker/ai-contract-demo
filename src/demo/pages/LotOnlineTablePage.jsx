import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import LotOnlineTable from '../components/LotOnlineTable';

export default function LotOnlineTablePage() {
  const navigate = useNavigate();
  const { state, setLotRows, confirmLotTable } = useDemoFlow();

  return (
    <div className="demo-page">
      <PageHeader
        title="拍品清单线上表格确认"
        description="合同编号为关键匹配字段 · 列来自 lotColumnsSchema"
        actions={[{ label: '返回工作台', onClick: () => navigate('/demo') }]}
      />
      <p className="demo-page__tip">
        合同编号为空、低置信度或与主合同表不一致时将高亮为冲突/缺失。
      </p>
      <LotOnlineTable rows={state.mockLotRows} onRowsChange={setLotRows} />
      <div className="demo-page__footer">
        <Button type="button" variant="default" onClick={() => navigate('/demo')}>
          取消
        </Button>
        <Button
          type="button"
          variant="primary"
          data-flow-action="A-P05-001"
          onClick={() => {
            confirmLotTable();
            navigate('/demo');
          }}
        >
          确认拍品清单
        </Button>
      </div>
    </div>
  );
}
