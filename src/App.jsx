import { Routes, Route, Navigate } from 'react-router-dom';
import { screens } from './screens';
import AppLayout from './components/AppLayout';
import DemoLayout from './demo/DemoLayout';
import AiWorkbenchPage from './demo/pages/AiWorkbenchPage';
import UploadRecognitionPage from './demo/pages/UploadRecognitionPage';
import ContractOnlineTablePage from './demo/pages/ContractOnlineTablePage';
import LotOnlineTablePage from './demo/pages/LotOnlineTablePage';
import DraftPreviewPage from './demo/pages/DraftPreviewPage';
import CustomerConfirmPage from './demo/pages/CustomerConfirmPage';
import SubmitCheckPage from './demo/pages/SubmitCheckPage';
import PrototypeView from './views/PrototypeView';
import ScreenMapView from './views/ScreenMapView';
import ScreenMapPage from './views/ScreenMapPage';
import DesignExportPage from './views/DesignExportPage';
import EmbedPresetPage from './embed/EmbedPresetPage';
import InteractionDocView from './views/InteractionDocView';
import ComponentGallery from './views/ComponentGallery';
import SchemaDemoPage from './views/SchemaDemoPage';
import { getScreenComponent } from './pages';

function ScreenPage({ screen }) {
  const Component = getScreenComponent(screen.id);
  return <Component screen={screen} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/embed/:preset" element={<EmbedPresetPage />} />

      <Route path="/demo" element={<DemoLayout />}>
        <Route index element={<AiWorkbenchPage />} />
        <Route path="upload" element={<UploadRecognitionPage />} />
        <Route path="contract-table" element={<ContractOnlineTablePage />} />
        <Route path="lot-table" element={<LotOnlineTablePage />} />
        <Route path="customer-confirm" element={<CustomerConfirmPage />} />
        <Route path="draft-preview" element={<DraftPreviewPage />} />
        <Route path="submit-check" element={<SubmitCheckPage />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/demo" replace />} />
        <Route path="schema-demo" element={<SchemaDemoPage />} />
        <Route path="gallery" element={<ComponentGallery />} />
        <Route path="prototype/*" element={<PrototypeView />} />
        <Route path="map" element={<ScreenMapView />} />
        <Route path="screen-map" element={<ScreenMapPage />} />
        <Route path="screen-map-real" element={<Navigate to="/screen-map" replace />} />
        <Route path="design-export" element={<DesignExportPage />} />
        <Route path="doc" element={<InteractionDocView />} />
        {screens.map((screen) => (
          <Route
            key={screen.id}
            path={screen.path.replace(/^\//, '')}
            element={<ScreenPage screen={screen} />}
          />
        ))}
      </Route>
    </Routes>
  );
}
