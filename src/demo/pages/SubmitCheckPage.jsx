import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import { buildSubmitCheckItems } from '../../data/demoFlowState';
import SubmitCheckList from '../components/SubmitCheckList';

export default function SubmitCheckPage() {
  const navigate = useNavigate();
  const { state } = useDemoFlow();

  const items = useMemo(() => buildSubmitCheckItems(state), [state]);
  const allPass = items.every((i) => i.pass);

  return (
    <div className="demo-page">
      <PageHeader
        title="提交审核检查"
        description="提交前检查清单（Demo，不真实提交）"
        actions={[{ label: '返回工作台', onClick: () => navigate('/demo') }]}
      />
      <SubmitCheckList items={items} allPass={allPass} />
      <div className="demo-page__footer">
        <Button type="button" variant="default" onClick={() => navigate('/demo')}>
          返回
        </Button>
        <Button
          type="button"
          variant="primary"
          data-flow-action="A-P09-001"
          disabled={!allPass}
          onClick={() => window.alert('[Demo] 已模拟提交审核')}
        >
          提交审核
        </Button>
      </div>
    </div>
  );
}
