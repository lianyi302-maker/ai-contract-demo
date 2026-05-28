import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import UploadMaterialsCard from '../components/UploadMaterialsCard';
import RecognitionProgress from '../components/RecognitionProgress';
import { useMockRecognition } from '../hooks/useMockRecognition';

/**
 * 备用独立上传页（主流程已在 AI 浮层内完成）
 */
export default function UploadRecognitionPage() {
  const navigate = useNavigate();
  const { completeUpload, completeRecognition } = useDemoFlow();

  const recognition = useMockRecognition({
    onComplete: () => {
      completeRecognition();
      navigate('/demo');
    },
  });

  return (
    <div className="demo-page">
      <PageHeader
        title="上传与识别（备用页）"
        description="主流程请使用 /demo 工作台 AI 浮层；本页保留用于调试"
        actions={[{ label: '返回工作台', onClick: () => navigate('/demo') }]}
      />

      {!recognition.isRunning ? (
        <UploadMaterialsCard
          className="upload-materials-card--page"
          onStartRecognition={(files) => {
            completeUpload(files);
            recognition.start();
          }}
        />
      ) : (
        <div className="demo-recognition-panel" data-flow-action="A-P02-002">
          <RecognitionProgress currentStep={recognition.step} progress={recognition.progress} />
          <p style={{ marginTop: 16, color: 'var(--ui-text-secondary)' }}>
            正在模拟识别，请稍候…
          </p>
        </div>
      )}

      {recognition.phase === 'idle' && !recognition.isRunning ? (
        <div className="demo-page__footer">
          <Button type="button" variant="default" onClick={() => navigate('/demo')}>
            返回工作台
          </Button>
        </div>
      ) : null}
    </div>
  );
}
