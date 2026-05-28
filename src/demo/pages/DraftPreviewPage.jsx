import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import { DRAFT_STATUS } from '../../data/demoFlowState';
import DraftPreviewCard from '../components/DraftPreviewCard';
import RecognitionProgress from '../components/RecognitionProgress';

export default function DraftPreviewPage() {
  const navigate = useNavigate();
  const { state, completeDraftGeneration } = useDemoFlow();
  const generating = state.draftStatus === DRAFT_STATUS.GENERATING;

  useEffect(() => {
    if (!generating) return undefined;
    const t = setTimeout(() => {
      completeDraftGeneration();
    }, 2000);
    return () => clearTimeout(t);
  }, [generating, completeDraftGeneration]);

  return (
    <div className="demo-page">
      <PageHeader
        title="草稿生成结果"
        description="复用真实系统截图作为生成结果预览（非重新实现页面）"
        actions={[{ label: '返回工作台', onClick: () => navigate('/demo') }]}
      />

      {generating ? (
        <div className="demo-recognition-panel">
          <p>正在生成系统草稿…</p>
          <RecognitionProgress currentStep={2} progress={65} />
        </div>
      ) : (
        <div className="demo-draft-grid">
          <DraftPreviewCard
            title="已生成主合同草稿"
            imageSrc="/references/main-contract-page.png"
            imageAlt="主合同录入系统页面"
          />
          <DraftPreviewCard
            title="已生成拍品清单草稿"
            imageSrc="/references/lot-list-page.png"
            imageAlt="拍品清单导入后状态页面"
          />
        </div>
      )}

      {!generating ? (
        <div className="demo-page__footer">
          <Button
            variant="primary"
            type="button"
            data-flow-action="A-P07-001"
            onClick={() => navigate('/demo')}
          >
            返回 AI 工作台
          </Button>
        </div>
      ) : null}
    </div>
  );
}
