import { PageHeader } from '../ui';
import AiWorkbenchPage from '../demo/pages/AiWorkbenchPage';
import ContractOnlineTablePage from '../demo/pages/ContractOnlineTablePage';
import LotOnlineTablePage from '../demo/pages/LotOnlineTablePage';
import DraftPreviewPage from '../demo/pages/DraftPreviewPage';
import SubmitCheckPage from '../demo/pages/SubmitCheckPage';
import UploadFlowCard from '../demo/components/UploadFlowCard';
import RecognitionProgress from '../demo/components/RecognitionProgress';

function EmbedChrome({ title, description, children }) {
  return (
    <div className="embed-viewport">
      <PageHeader title={title} description={description} />
      {children}
    </div>
  );
}

export const EMBED_VIEWS = {
  'workbench-init': AiWorkbenchPage,
  'workbench-indexed': AiWorkbenchPage,
  'upload-idle': function EmbedUploadIdle() {
    return (
      <EmbedChrome title="上传与识别" description="待上传 · 嵌入预览">
        <UploadFlowCard onStartRecognition={() => {}} />
      </EmbedChrome>
    );
  },
  'upload-recognizing': function EmbedUploadRecognizing() {
    return (
      <EmbedChrome title="上传与识别" description="识别中 · 嵌入预览">
        <div className="demo-recognition-panel">
          <RecognitionProgress currentStep={1} progress={45} />
          <p style={{ marginTop: 16, color: 'var(--ui-text-secondary)' }}>
            正在模拟识别，请稍候…
          </p>
        </div>
      </EmbedChrome>
    );
  },
  'contract-pending': ContractOnlineTablePage,
  'lot-pending': LotOnlineTablePage,
  'draft-generating': DraftPreviewPage,
  'draft-done': DraftPreviewPage,
  'submit-check': SubmitCheckPage,
};
