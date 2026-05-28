import Button from '../primitives/Button';

/**
 * 导出 PNG / 打印 PDF
 */
export default function ExportToolbar({
  onExportPng,
  onPrintPdf,
  exporting = false,
  className = '',
}) {
  return (
    <div className={`ui-export-toolbar ${className}`.trim()}>
      <Button
        type="button"
        variant="default"
        disabled={exporting}
        onClick={onExportPng}
      >
        导出 PNG
      </Button>
      <Button
        type="button"
        variant="primary"
        disabled={exporting}
        onClick={onPrintPdf}
      >
        打印 / PDF
      </Button>
    </div>
  );
}
