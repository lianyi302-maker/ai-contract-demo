import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DemoFlowProvider } from '../context/DemoFlowContext';
import { EMBED_VIEWS } from './EmbedViews';
import { getEmbedPresetState } from './embedPresets';
import '../demo/demo.css';
import '../styles/real-screen-map.css';

export default function EmbedPresetPage() {
  const { preset } = useParams();
  const initialState = useMemo(() => getEmbedPresetState(preset), [preset]);
  const View = EMBED_VIEWS[preset];

  if (!View) {
    return (
      <div className="embed-viewport embed-viewport--error">
        <p>未知预览：{preset}</p>
      </div>
    );
  }

  return (
    <DemoFlowProvider initialState={initialState}>
      <View />
    </DemoFlowProvider>
  );
}
