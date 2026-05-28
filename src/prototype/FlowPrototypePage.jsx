import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DemoFlowProvider } from '../context/DemoFlowContext';
import { getFlowPageById } from '../flowSpec';
import { getEmbedPresetState } from '../embed/embedPresets';
import ActionAnnotationOverlay from '../components/flow/ActionAnnotationOverlay';
import { useAnnotationMode } from '../context/AnnotationModeContext';
import AiWorkbenchPage from '../demo/pages/AiWorkbenchPage';
import UploadRecognitionPage from '../demo/pages/UploadRecognitionPage';
import ContractOnlineTablePage from '../demo/pages/ContractOnlineTablePage';
import LotOnlineTablePage from '../demo/pages/LotOnlineTablePage';
import DraftPreviewPage from '../demo/pages/DraftPreviewPage';
import SubmitCheckPage from '../demo/pages/SubmitCheckPage';

const PAGE_COMPONENTS = {
  P01: AiWorkbenchPage,
  P02: UploadRecognitionPage,
  P03: AiWorkbenchPage,
  P04: ContractOnlineTablePage,
  P05: LotOnlineTablePage,
  P06: AiWorkbenchPage,
  P07: DraftPreviewPage,
  P08: AiWorkbenchPage,
  P09: SubmitCheckPage,
};

export default function FlowPrototypePage() {
  const { pageId: rawId } = useParams();
  const pageId = rawId?.toUpperCase();
  const page = getFlowPageById(pageId);
  const { enabled, setEnabled } = useAnnotationMode();

  const initialState = useMemo(() => {
    if (!page?.prototypePreset) return undefined;
    return getEmbedPresetState(page.prototypePreset);
  }, [page?.prototypePreset]);

  if (!page) {
    return <Navigate to="/prototype" replace />;
  }

  const PageComponent = PAGE_COMPONENTS[pageId];
  if (!PageComponent) {
    return <Navigate to="/prototype" replace />;
  }

  return (
    <div className="flow-prototype">
      <header className="flow-prototype__toolbar">
        <Link to="/prototype" className="flow-prototype__back">
          ← Prototype 索引
        </Link>
        <div className="flow-prototype__title">
          <span className="flow-prototype__page-id">{page.id}</span>
          <h1>{page.name}</h1>
        </div>
        <label className="flow-prototype__annotate-toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Annotation Mode
        </label>
        <Link to={page.demoPath} className="flow-prototype__demo-link">
          在 Demo 中打开 ↗
        </Link>
      </header>

      <div className="flow-prototype__stage" data-flow-prototype-root>
        <DemoFlowProvider initialState={initialState}>
          <PageComponent />
        </DemoFlowProvider>
        <ActionAnnotationOverlay pageId={pageId} />
      </div>
    </div>
  );
}
