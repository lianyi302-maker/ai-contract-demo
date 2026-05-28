import { useState } from 'react';
import { Button } from '../../ui';
import { MOCK_UPLOAD_FILES } from '../constants/mockUploadFiles';
import UploadedFileList from './UploadedFileList';

/**
 * AI 对话内的上传材料任务卡片
 */
export default function UploadMaterialsCard({
  onStartRecognition,
  disabled = false,
  className = '',
}) {
  const [files, setFiles] = useState(() => [...MOCK_UPLOAD_FILES]);

  return (
    <div className={`upload-materials-card ${disabled ? 'upload-materials-card--disabled' : ''} ${className}`.trim()}>
      <h4 className="upload-materials-card__title">上传纸质合同与拍品清单</h4>
      <p className="upload-materials-card__desc">
        请上传纸质主合同、纸质拍品清单或已有 Excel 清单，AI 将识别并生成线上表格。
      </p>

      <div className="upload-materials-card__zones">
        <div className="upload-materials-card__zone">
          <span className="upload-materials-card__zone-label">上传纸质主合同</span>
          <span className="upload-materials-card__zone-hint">支持 PDF · Demo 不打开本地文件夹</span>
          <button type="button" className="upload-materials-card__zone-btn" disabled={disabled}>
            选择文件
          </button>
        </div>
        <div className="upload-materials-card__zone">
          <span className="upload-materials-card__zone-label">上传纸质拍品清单</span>
          <span className="upload-materials-card__zone-hint">支持 Excel / 图片 · Demo 模拟上传</span>
          <button type="button" className="upload-materials-card__zone-btn" disabled={disabled}>
            选择文件
          </button>
        </div>
      </div>

      <div className="upload-materials-card__files">
        <span className="upload-materials-card__files-label">已上传文件</span>
        <UploadedFileList
          files={files}
          onRemove={disabled ? undefined : (id) => setFiles((p) => p.filter((f) => f.id !== id))}
        />
      </div>

      <Button
        variant="primary"
        type="button"
        className="upload-materials-card__submit"
        data-flow-action="A-P02-001"
        disabled={disabled || !files.length}
        onClick={() => onStartRecognition?.(files)}
      >
        开始识别
      </Button>
    </div>
  );
}
