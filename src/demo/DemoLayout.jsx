import { Outlet, Link, useLocation } from 'react-router-dom';
import { DemoFlowProvider } from '../context/DemoFlowContext';
import { Button } from '../ui';
import { useDemoFlow } from '../context/DemoFlowContext';

function DemoLayoutInner() {
  const { resetDemo } = useDemoFlow();
  const location = useLocation();
  const isWorkbenchHome =
    location.pathname === '/demo' || location.pathname === '/demo/';

  return (
    <div className="demo-layout">
      <header className="demo-layout__header">
        <Link to="/demo" className="demo-layout__brand">
          AI 合同录入助手 Demo
        </Link>
        <nav className="demo-layout__nav">
          <Link to="/demo" className={location.pathname === '/demo' ? 'active' : ''}>
            工作台
          </Link>
          <Link to="/demo/upload">上传识别</Link>
          <Link to="/demo/contract-table">主合同表</Link>
          <Link to="/demo/lot-table">拍品表</Link>
          <Link to="/demo/customer-confirm">客户确认</Link>
          <Link to="/demo/draft-preview">草稿预览</Link>
          <Link to="/demo/submit-check">提交检查</Link>
        </nav>
        <Button type="button" variant="ghost" size="sm" onClick={resetDemo}>
          重置 Demo
        </Button>
      </header>
      <main
        className={`demo-layout__main ${isWorkbenchHome ? 'demo-layout__main--immersive' : ''}`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default function DemoLayout() {
  return (
    <DemoFlowProvider>
      <DemoLayoutInner />
    </DemoFlowProvider>
  );
}
