import WorkbenchBackground from '../components/WorkbenchBackground';
import AiChatPanel from '../components/AiChatPanel';

export default function AiWorkbenchPage() {
  return (
    <div className="demo-workbench-scene">
      <WorkbenchBackground />
      <div className="demo-workbench-scene__scrim" aria-hidden />
      <div className="demo-workbench-scene__float">
        <AiChatPanel />
      </div>
    </div>
  );
}
