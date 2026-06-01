import { useState } from 'react';
import { Button } from '../../ui';
import GeneratedAgreementCard from '../../ui/ai/GeneratedAgreementCard';
import { mockAgreementDraft } from '../../mock/index';

/**
 * 对话内「创建拍品协议」任务卡片
 */
export default function LotAgreementCard({ disabled = false, className = '' }) {
  const [contractNo, setContractNo] = useState('CN-2025-SPR-00821');
  const [draft, setDraft] = useState(null);

  const handleCreate = () => {
    if (disabled) return;
    setDraft({
      ...mockAgreementDraft,
      title: `拍品协议（草稿）· ${contractNo}`,
    });
  };

  return (
    <div
      className={`upload-materials-card lot-agreement-card ${disabled ? 'upload-materials-card--disabled' : ''} ${className}`.trim()}
    >
      <h4 className="upload-materials-card__title">创建拍品协议</h4>
      <p className="upload-materials-card__desc">
        选择关联主合同后，系统将基于拍品清单生成拍品协议草稿，可在正式环境中对接法务模板服务。
      </p>

      <label className="lot-agreement-card__field">
        <span className="lot-agreement-card__label">关联主合同编号</span>
        <input
          className="lot-agreement-card__input"
          value={contractNo}
          onChange={(e) => setContractNo(e.target.value)}
          disabled={disabled}
          placeholder="请输入合同编号"
        />
      </label>

      <Button
        variant="primary"
        type="button"
        className="upload-materials-card__submit"
        disabled={disabled || !contractNo.trim()}
        onClick={handleCreate}
      >
        生成协议草稿
      </Button>

      {draft ? (
        <div className="lot-agreement-card__draft">
          <GeneratedAgreementCard
            title={draft.title}
            parties={draft.parties}
            clause={draft.clause}
            generatedAt={draft.generatedAt}
            onCopy={() => window.alert('[Demo] 已复制协议草稿内容')}
            onDownload={() => window.alert('[Demo] 下载拍品协议草稿.pdf')}
          />
        </div>
      ) : null}
    </div>
  );
}
