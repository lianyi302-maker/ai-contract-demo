import { useMemo, useState } from 'react';
import { Button } from '../../ui';
import { MOCK_UPLOAD_FILES } from '../constants/mockUploadFiles';
import UploadedFileList from './UploadedFileList';
import CustomerUploadSection from './CustomerUploadSection';

const CARD_COPY = {
  contract: {
    title: '上传纸质主合同',
    desc: '请上传纸质主合同 PDF 或扫描件，AI 将识别并生成主合同线上表格。',
  },
  lot: {
    title: '上传拍品清单',
    desc: '请上传纸质拍品清单或 Excel 附件，AI 将识别并生成拍品清单线上表格。',
  },
  both: {
    title: '上传纸质合同与拍品清单',
    desc: '请上传纸质主合同、纸质拍品清单或已有 Excel 清单，AI 将识别并生成线上表格。',
  },
};

function filterFilesByMode(mode) {
  if (mode === 'contract') return MOCK_UPLOAD_FILES.filter((f) => f.type === 'contract');
  if (mode === 'lot') return MOCK_UPLOAD_FILES.filter((f) => f.type === 'lotList');
  return [...MOCK_UPLOAD_FILES];
}

/**
 * AI 对话内的上传材料任务卡片
 * @param {'contract' | 'lot' | 'both'} mode
 */
export default function UploadMaterialsCard({
  mode = 'both',
  onStartRecognition,
  customerUploadGroups,
  onCustomerUploadGroupsChange,
  onCustomerUploadComplete,
  disabled = false,
  className = '',
}) {
  const [files, setFiles] = useState(() => filterFilesByMode(mode));
  const [showCustomerUpload, setShowCustomerUpload] = useState(false);
  const copy = CARD_COPY[mode] ?? CARD_COPY.both;
  const showContractZone = mode === 'contract' || mode === 'both';
  const showLotZone = mode === 'lot' || mode === 'both';
  const showCustomerEntry = mode === 'both';

  const zones = useMemo(() => {
    const items = [];
    if (showContractZone) {
      items.push({
        key: 'contract',
        label: '上传纸质主合同',
        hint: '支持 PDF · Demo 不打开本地文件夹',
      });
    }
    if (showLotZone) {
      items.push({
        key: 'lot',
        label: '上传纸质拍品清单',
        hint: '支持 Excel / 图片 · Demo 模拟上传',
      });
    }
    return items;
  }, [showContractZone, showLotZone]);

  return (
    <div className={`upload-materials-card ${disabled ? 'upload-materials-card--disabled' : ''} ${className}`.trim()}>
      <h4 className="upload-materials-card__title">{copy.title}</h4>
      <p className="upload-materials-card__desc">{copy.desc}</p>

      <div className="upload-materials-card__zones">
        {zones.map((zone) => (
          <div key={zone.key} className="upload-materials-card__zone">
            <span className="upload-materials-card__zone-label">{zone.label}</span>
            <span className="upload-materials-card__zone-hint">{zone.hint}</span>
            <button type="button" className="upload-materials-card__zone-btn" disabled={disabled}>
              选择文件
            </button>
          </div>
        ))}
      </div>

      {showCustomerEntry ? (
        <>
          <div className="upload-materials-card__customer-entry">
            <button
              type="button"
              className="upload-materials-card__customer-btn"
              disabled={disabled}
              data-flow-action="A-P02-004"
              onClick={() => setShowCustomerUpload((v) => !v)}
            >
              上传客户证件
            </button>
            <p className="upload-materials-card__customer-hint">
              支持个人身份证及企业证照，可批量上传，AI 将自动识别客户信息
            </p>
          </div>

          {showCustomerUpload ? (
            <CustomerUploadSection
              groups={customerUploadGroups}
              onChange={onCustomerUploadGroupsChange}
              onStartUpload={onCustomerUploadComplete}
              disabled={disabled}
            />
          ) : null}
        </>
      ) : null}

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
