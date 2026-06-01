import { Button } from '../../ui';
import { CUSTOMER_TYPE } from '../../data/demoFlowState';
import { createCustomerUploadGroup } from '../../mock/mockCustomers';

function slotLabel(slot) {
  if (!slot) return null;
  if (typeof slot === 'string') return slot;
  if (typeof slot === 'object' && slot.uploaded) return slot.name || '已上传';
  return null;
}

function uploadStatusText(group) {
  if (!group.uploadDone) return null;
  if (group.customerType === CUSTOMER_TYPE.PERSONAL) {
    const front = slotLabel(group.uploads.front);
    const back = slotLabel(group.uploads.back);
    if (front && back) return '证件正反面已上传';
    if (front && !back) return '缺少证件反面';
    return '证件未上传';
  }
  const license = slotLabel(group.uploads.license);
  const supplement = slotLabel(group.uploads.supplement);
  return `${license ? '营业执照已上传' : '营业执照未上传'} · ${supplement ? '补充资料已上传' : '补充资料未上传'}`;
}

function mockFileName(type, index) {
  const map = {
    front: `身份证正面_客户${index}.jpg`,
    back: `身份证反面_客户${index}.jpg`,
    license: `营业执照_客户${index}.jpg`,
    supplement: `补充资料_客户${index}.pdf`,
  };
  return map[type];
}

export default function CustomerUploadSection({
  groups,
  onChange,
  onStartUpload,
  onStartRecognition,
  disabled = false,
}) {
  const updateGroup = (id, patch) => {
    onChange?.(groups.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };

  const removeGroup = (id) => {
    if (groups.length <= 1) return;
    onChange?.(groups.filter((g) => g.id !== id));
  };

  const addGroup = () => {
    onChange?.([...groups, createCustomerUploadGroup(groups.length + 1)]);
  };

  const simulateUpload = (groupId, slot) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const index = groups.findIndex((g) => g.id === groupId) + 1;
    updateGroup(groupId, {
      uploads: {
        ...group.uploads,
        [slot]: mockFileName(slot, index),
      },
    });
  };

  const handleStartRecognition = () => {
    const next = groups.map((g, i) => {
      const index = i + 1;
      if (g.customerType === CUSTOMER_TYPE.PERSONAL) {
        return {
          ...g,
          uploadDone: true,
          uploads: {
            front: g.uploads.front || mockFileName('front', index),
            back: g.uploads.back || (index === 2 ? null : mockFileName('back', index)),
            license: null,
            supplement: null,
          },
        };
      }
      return {
        ...g,
        uploadDone: true,
        uploads: {
          front: null,
          back: null,
          license: g.uploads.license || mockFileName('license', index),
          supplement: g.uploads.supplement || mockFileName('supplement', index),
        },
      };
    });
    onChange?.(next);
    onStartUpload?.(next);
    onStartRecognition?.(next);
  };

  const recognitionLabel = onStartRecognition ? '开始识别' : '开始上传';

  return (
    <div className="customer-upload-section">
      <h5 className="customer-upload-section__title">上传客户证件</h5>
      <p className="customer-upload-section__desc">
        支持个人身份证及企业证照，可批量上传，AI 将自动识别客户信息
      </p>

      <div className="customer-upload-section__cards">
        {groups.map((group, index) => (
          <div key={group.id} className="customer-upload-card">
            <div className="customer-upload-card__head">
              <strong>{group.label || `客户 ${index + 1}`}</strong>
              {groups.length > 1 ? (
                <button
                  type="button"
                  className="customer-upload-card__remove"
                  disabled={disabled}
                  onClick={() => removeGroup(group.id)}
                >
                  删除
                </button>
              ) : null}
            </div>

            <div className="customer-upload-card__type">
              <label className="customer-upload-card__type-option">
                <input
                  type="radio"
                  name={`type-${group.id}`}
                  checked={group.customerType === CUSTOMER_TYPE.PERSONAL}
                  disabled={disabled || group.uploadDone}
                  onChange={() =>
                    updateGroup(group.id, {
                      customerType: CUSTOMER_TYPE.PERSONAL,
                      uploads: { front: null, back: null, license: null, supplement: null },
                      uploadDone: false,
                    })
                  }
                />
                个人客户
              </label>
              <label className="customer-upload-card__type-option">
                <input
                  type="radio"
                  name={`type-${group.id}`}
                  checked={group.customerType === CUSTOMER_TYPE.ENTERPRISE}
                  disabled={disabled || group.uploadDone}
                  onChange={() =>
                    updateGroup(group.id, {
                      customerType: CUSTOMER_TYPE.ENTERPRISE,
                      uploads: { front: null, back: null, license: null, supplement: null },
                      uploadDone: false,
                    })
                  }
                />
                企业客户
              </label>
            </div>

            {group.customerType === CUSTOMER_TYPE.PERSONAL ? (
              <>
                <p className="customer-upload-card__hint">支持身份证等个人证件，正反面需成组上传</p>
                <div className="customer-upload-card__slots">
                  <button
                    type="button"
                    className="customer-upload-card__slot"
                    disabled={disabled || group.uploadDone}
                    onClick={() => simulateUpload(group.id, 'front')}
                  >
                    {slotLabel(group.uploads.front) ? `已选：${slotLabel(group.uploads.front)}` : '上传证件正面'}
                  </button>
                  <button
                    type="button"
                    className="customer-upload-card__slot"
                    disabled={disabled || group.uploadDone}
                    onClick={() => simulateUpload(group.id, 'back')}
                  >
                    {slotLabel(group.uploads.back) ? `已选：${slotLabel(group.uploads.back)}` : '上传证件反面'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="customer-upload-card__hint">支持营业执照及其他企业证明资料</p>
                <div className="customer-upload-card__slots">
                  <button
                    type="button"
                    className="customer-upload-card__slot"
                    disabled={disabled || group.uploadDone}
                    onClick={() => simulateUpload(group.id, 'license')}
                  >
                    {slotLabel(group.uploads.license) ? `已选：${slotLabel(group.uploads.license)}` : '上传营业执照'}
                  </button>
                  <button
                    type="button"
                    className="customer-upload-card__slot"
                    disabled={disabled || group.uploadDone}
                    onClick={() => simulateUpload(group.id, 'supplement')}
                  >
                    {slotLabel(group.uploads.supplement) ? `已选：${slotLabel(group.uploads.supplement)}` : '上传补充资料'}
                  </button>
                </div>
              </>
            )}

            {group.uploadDone ? (
              <p className="customer-upload-card__status" role="status">
                {uploadStatusText(group)}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="customer-upload-section__actions">
        <Button variant="ghost" size="sm" type="button" disabled={disabled} onClick={addGroup}>
          + 增加客户
        </Button>
        <Button
          variant="primary"
          type="button"
          data-flow-action="A-P02-001"
          disabled={disabled}
          onClick={handleStartRecognition}
        >
          {recognitionLabel}
        </Button>
      </div>
    </div>
  );
}
