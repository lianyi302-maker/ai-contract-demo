import { Routes, Route, Link } from 'react-router-dom';
import { flowPages } from '../flowSpec';
import { AnnotationModeProvider } from '../context/AnnotationModeContext';
import FlowPrototypePage from '../prototype/FlowPrototypePage';

function PrototypeIndex() {
  return (
    <>
      <header className="view-heading">
        <h1>Prototype View</h1>
        <p>
          可点击 Demo 原型（按 flowSpec 页面分态）· 开启 Annotation Mode 查看触点编号与跳转说明
        </p>
      </header>
      <div className="proto-index">
        {flowPages.map((p) => (
          <Link key={p.id} to={`/prototype/${p.id}`} className="proto-index-card">
            <div className="id">{p.id}</div>
            <div className="name">{p.name}</div>
            <p className="proto-index-card__summary">{p.summary}</p>
          </Link>
        ))}
      </div>
      <p className="proto-sidebar-hint">
        截图仅出现在 P07 草稿预览的结果区，不作为本视图内容来源。
      </p>
    </>
  );
}

export default function PrototypeView() {
  return (
    <AnnotationModeProvider>
      <Routes>
        <Route index element={<PrototypeIndex />} />
        <Route path=":pageId" element={<FlowPrototypePage />} />
      </Routes>
    </AnnotationModeProvider>
  );
}
