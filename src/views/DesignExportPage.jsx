import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import {
  toFlowSpecJson,
  toFlowSpecCsv,
  toMermaidFlowchart,
  toInteractionMarkdown,
  downloadTextFile,
} from '../flowSpec/exportFormatters';

const FORMATS = [
  { key: 'json', label: 'flowSpec.json', mime: 'application/json;charset=utf-8' },
  { key: 'csv', label: 'flowSpec.csv', mime: 'text/csv;charset=utf-8' },
  { key: 'mermaid', label: 'flowchart.mmd', mime: 'text/plain;charset=utf-8' },
  { key: 'md', label: 'interaction.md', mime: 'text/markdown;charset=utf-8' },
];

export default function DesignExportPage() {
  const [previewKey, setPreviewKey] = useState('json');

  const previews = useMemo(
    () => ({
      json: toFlowSpecJson(),
      csv: toFlowSpecCsv(),
      mermaid: toMermaidFlowchart(),
      md: toInteractionMarkdown(),
    }),
    []
  );

  const handleDownload = (key) => {
    const format = FORMATS.find((f) => f.key === key);
    downloadTextFile(format.label, previews[key], format.mime);
  };

  return (
    <div className="design-export-page">
      <header className="design-export-page__header">
        <div>
          <h1>Design Export · Flow Spec</h1>
          <p>导出可二创的流程结构，数据源为 flowSpec.js</p>
        </div>
        <div className="design-export-page__links">
          <Link to="/screen-map">
            <Button type="button" variant="ghost">
              Screen Map
            </Button>
          </Link>
          <Link to="/prototype">
            <Button type="button" variant="primary">
              Prototype View
            </Button>
          </Link>
        </div>
      </header>

      <div className="design-export-page__formats">
        {FORMATS.map((f) => (
          <div key={f.key} className="design-export-card">
            <h3>{f.label}</h3>
            <div className="design-export-card__actions">
              <Button type="button" variant="primary" size="sm" onClick={() => handleDownload(f.key)}>
                下载
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreviewKey(f.key)}
              >
                预览
              </Button>
            </div>
          </div>
        ))}
      </div>

      <section className="design-export-page__preview">
        <h2>预览 · {FORMATS.find((f) => f.key === previewKey)?.label}</h2>
        <pre className="design-export-page__pre">{previews[previewKey]}</pre>
      </section>
    </div>
  );
}
