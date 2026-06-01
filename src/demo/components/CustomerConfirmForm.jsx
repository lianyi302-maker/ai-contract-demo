import { useMemo, useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui';
import {
  CUSTOMER_SOURCE,
  CUSTOMER_STATUS,
  CUSTOMER_TYPE,
} from '../../data/demoFlowState';
import { isCustomerRequiredFieldsFilled } from '../utils/customerConfirmUtils';

function AiTag() {
  return <span className="customer-confirm-form__ai-tag">AI 识别</span>;
}

function FormField({
  label,
  required = false,
  aiFilled = false,
  children,
  hint,
  error,
}) {
  return (
    <div className={`customer-confirm-form__field${error ? ' customer-confirm-form__field--error' : ''}`}>
      <label className="customer-confirm-form__label">
        {required ? <span className="customer-confirm-form__req">*</span> : null}
        {label}
        {aiFilled ? <AiTag /> : null}
      </label>
      {children}
      {hint ? <p className="customer-confirm-form__hint">{hint}</p> : null}
      {error ? <p className="customer-confirm-form__error">{error}</p> : null}
    </div>
  );
}

function Section({ title, required, children }) {
  return (
    <section className="customer-confirm-form__section">
      <h3 className="customer-confirm-form__section-title">
        {title}
        {required ? <span className="customer-confirm-form__section-req">合同必填</span> : null}
      </h3>
      {children}
    </section>
  );
}

function TextInput({ value, onChange, type = 'text', placeholder, disabled }) {
  return (
    <input
      className="customer-confirm-form__input"
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

function SelectInput({ value, onChange, options, disabled }) {
  return (
    <select
      className="customer-confirm-form__input"
      value={value ?? ''}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">请选择</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

const GENDER_OPTIONS = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
];

const ID_TYPE_OPTIONS = [
  { value: 'idCard', label: '身份证' },
  { value: 'passport', label: '护照' },
  { value: 'businessLicense', label: '营业执照' },
];

const ID_STATUS_OPTIONS = [
  { value: 'valid', label: '有效' },
  { value: 'pending', label: '待核验' },
  { value: 'expired', label: '已过期' },
];

const ADDRESS_TYPE_OPTIONS = [
  { value: 'mailing', label: '邮寄地址' },
  { value: 'registered', label: '注册地址' },
  { value: 'other', label: '其他' },
];

const MAIL_METHOD_OPTIONS = [
  { value: 'express', label: '快递' },
  { value: 'standard', label: '平邮' },
  { value: 'pickup', label: '自取' },
];

export default function CustomerConfirmForm({
  customer,
  onSave,
  onConfirm,
  disabled = false,
  showFooter = true,
  onActionsReady,
}) {
  const [draft, setDraft] = useState(customer);

  useEffect(() => {
    setDraft(customer);
  }, [customer.id, customer.status]);

  const isComplete = useMemo(() => isCustomerRequiredFieldsFilled(draft), [draft]);
  const isPersonal = draft.customerType === CUSTOMER_TYPE.PERSONAL;
  const ai = new Set(draft.aiFilled || []);
  const isDone = [CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(draft.status);

  const patch = (section, key, value) => {
    setDraft((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSave = useCallback(() => {
    onSave?.(draft.id, {
      account: draft.account,
      personal: draft.personal,
      idDocument: draft.idDocument,
      address: draft.address,
    });
  }, [draft, onSave]);

  const handleConfirm = useCallback(() => {
    onSave?.(draft.id, {
      account: draft.account,
      personal: draft.personal,
      idDocument: draft.idDocument,
      address: draft.address,
    });
    onConfirm?.(draft.id);
  }, [draft, onSave, onConfirm]);

  const confirmLabel = draft.existingInCrm ? '确认并更新客户' : '确认并创建客户';

  useEffect(() => {
    onActionsReady?.({
      handleSave,
      handleConfirm,
      disabled,
      isDone,
      isComplete,
      confirmLabel,
    });
  }, [onActionsReady, handleSave, handleConfirm, disabled, isDone, isComplete, confirmLabel]);

  const footer = showFooter ? (
    <div className="customer-confirm-form__footer">
      <Button type="button" variant="default" onClick={handleSave} disabled={disabled || isDone}>
        保存修改
      </Button>
      <Button
        type="button"
        variant="primary"
        data-flow-action="A-P10-001"
        disabled={disabled || isDone || !isComplete}
        onClick={handleConfirm}
      >
        {confirmLabel}
      </Button>
    </div>
  ) : null;

  if (!isPersonal) {
    return (
      <div>
        <Section title="企业客户信息" required>
          <p className="customer-confirm-form__enterprise-note">
            当前 Demo 重点实现个人客户确认场景。企业客户「{draft.name}」的基础字段已识别，完整表单将在后续迭代中补充。
          </p>
          <FormField label="企业名称" required aiFilled={ai.has('chineseName')}>
            <TextInput
              value={draft.personal.chineseName}
              onChange={(v) => patch('personal', 'chineseName', v)}
              disabled={isDone}
            />
          </FormField>
          <FormField label="统一社会信用代码" required aiFilled={ai.has('idNumber')}>
            <TextInput
              value={draft.idDocument.idNumber}
              onChange={(v) => patch('idDocument', 'idNumber', v)}
              disabled={isDone}
            />
          </FormField>
        </Section>
        {footer}
      </div>
    );
  }

  const accountMissing =
    !draft.account.mobilePhone?.trim() && !draft.account.email?.trim();

  return (
    <div>
      <Section title="账号信息">
        <p className="customer-confirm-form__rule">注册号码至少填写一项</p>
        <div className="customer-confirm-form__grid">
          <FormField label="手机号">
            <TextInput
              value={draft.account.mobilePhone}
              onChange={(v) => patch('account', 'mobilePhone', v)}
            />
          </FormField>
          <FormField label="邮箱">
            <TextInput
              value={draft.account.email}
              onChange={(v) => patch('account', 'email', v)}
            />
          </FormField>
          <FormField label="创建虚拟手机号">
            <label className="customer-confirm-form__checkbox">
              <input
                type="checkbox"
                checked={draft.account.virtualMobile}
                onChange={(e) => patch('account', 'virtualMobile', e.target.checked)}
              />
              启用虚拟手机号
            </label>
          </FormField>
        </div>
        {accountMissing ? (
          <p className="customer-confirm-form__warn">请填写手机号或邮箱至少一项。</p>
        ) : null}
      </Section>

      <Section title="个人信息">
        <div className="customer-confirm-form__grid">
          <FormField label="中文姓名" required aiFilled={ai.has('chineseName')}>
            <TextInput
              value={draft.personal.chineseName}
              onChange={(v) => patch('personal', 'chineseName', v)}
            />
          </FormField>
          <FormField label="繁体姓名">
            <TextInput
              value={draft.personal.traditionalName}
              onChange={(v) => patch('personal', 'traditionalName', v)}
            />
          </FormField>
          <FormField label="英文姓">
            <TextInput
              value={draft.personal.englishSurname}
              onChange={(v) => patch('personal', 'englishSurname', v)}
            />
          </FormField>
          <FormField label="英文名">
            <TextInput
              value={draft.personal.englishGivenName}
              onChange={(v) => patch('personal', 'englishGivenName', v)}
            />
          </FormField>
          <FormField label="性别" required aiFilled={ai.has('gender')}>
            <SelectInput
              value={draft.personal.gender}
              options={GENDER_OPTIONS}
              onChange={(v) => patch('personal', 'gender', v)}
            />
          </FormField>
          <FormField label="国籍" required aiFilled={ai.has('nationality')}>
            <TextInput
              value={draft.personal.nationality === 'CN' ? '中国' : draft.personal.nationality}
              onChange={(v) => patch('personal', 'nationality', v === '中国' ? 'CN' : v)}
            />
          </FormField>
          <FormField label="出生日期" aiFilled={ai.has('birthDate')}>
            <TextInput
              type="date"
              value={draft.personal.birthDate}
              onChange={(v) => patch('personal', 'birthDate', v)}
            />
          </FormField>
          <FormField label="民族" aiFilled={ai.has('ethnicity')}>
            <TextInput
              value={draft.personal.ethnicity}
              onChange={(v) => patch('personal', 'ethnicity', v)}
            />
          </FormField>
          <FormField label="联系邮箱">
            <TextInput
              value={draft.personal.contactEmail}
              onChange={(v) => patch('personal', 'contactEmail', v)}
            />
          </FormField>
          <FormField label="联系方式">
            <TextInput
              value={draft.personal.contactPhone}
              onChange={(v) => patch('personal', 'contactPhone', v)}
            />
          </FormField>
          <FormField label="备注" className="customer-confirm-form__field--full">
            <TextInput
              value={draft.personal.remarks}
              onChange={(v) => patch('personal', 'remarks', v)}
            />
          </FormField>
        </div>
      </Section>

      <Section title="证件信息" required>
        <div className="customer-confirm-form__grid">
          <FormField label="证件类型" required aiFilled={ai.has('idType')}>
            <SelectInput
              value={draft.idDocument.idType}
              options={ID_TYPE_OPTIONS}
              onChange={(v) => patch('idDocument', 'idType', v)}
            />
          </FormField>
          <FormField label="证件号码" required aiFilled={ai.has('idNumber')}>
            <TextInput
              value={draft.idDocument.idNumber}
              onChange={(v) => patch('idDocument', 'idNumber', v)}
            />
          </FormField>
          <FormField label="有效期" required aiFilled={ai.has('validUntil')}>
            <TextInput
              value={draft.idDocument.validUntil}
              onChange={(v) => patch('idDocument', 'validUntil', v)}
            />
          </FormField>
          <FormField label="证件状态" required>
            <SelectInput
              value={draft.idDocument.idStatus}
              options={ID_STATUS_OPTIONS}
              onChange={(v) => patch('idDocument', 'idStatus', v)}
            />
          </FormField>
          <FormField label="证件地址" aiFilled={ai.has('idAddress')} className="customer-confirm-form__field--full">
            <TextInput
              value={draft.idDocument.idAddress}
              onChange={(v) => patch('idDocument', 'idAddress', v)}
            />
          </FormField>
        </div>

        <div className="customer-confirm-form__photo-card">
          <div className="customer-confirm-form__photo-card-head">
            <span className="customer-confirm-form__photo-card-title">证件照片</span>
          </div>
          <div className="customer-confirm-form__photo-row">
            {[
              { key: 'front', label: '正面', photo: draft.idDocument.frontPhoto },
              { key: 'back', label: '背面', photo: draft.idDocument.backPhoto },
            ].map(({ key, label, photo }) => (
              <figure key={key} className="customer-confirm-form__photo-item">
                <div
                  className={`customer-confirm-form__photo-frame${
                    photo?.uploaded ? ' customer-confirm-form__photo-frame--filled' : ''
                  }`}
                >
                  {photo?.uploaded ? (
                    <>
                      <div className="customer-confirm-form__photo-preview" aria-hidden="true" />
                      {photo.name ? (
                        <span className="customer-confirm-form__photo-name">{photo.name}</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="customer-confirm-form__photo-empty">{label}未上传</span>
                  )}
                </div>
                <figcaption className="customer-confirm-form__photo-caption">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        {draft.source === CUSTOMER_SOURCE.ID_CARD && !draft.idDocument.backPhoto?.uploaded ? (
          <p className="customer-confirm-form__warn">
            证件背面缺失，有效期未识别，请补充上传后继续确认。
          </p>
        ) : null}
      </Section>

      <Section title="地址信息" required>
        {draft.address.autoFilledFromId ? (
          <p className="customer-confirm-form__hint-block">
            已根据证件地址自动填入，请确认是否作为邮寄地址使用。
          </p>
        ) : null}
        <div className="customer-confirm-form__grid">
          <FormField label="是否寄送图录">
            <label className="customer-confirm-form__checkbox">
              <input
                type="checkbox"
                checked={draft.address.sendCatalog}
                onChange={(e) => patch('address', 'sendCatalog', e.target.checked)}
              />
              寄送图录
            </label>
          </FormField>
          <FormField label="是否寄送其他文件">
            <label className="customer-confirm-form__checkbox">
              <input
                type="checkbox"
                checked={draft.address.sendOtherDocs}
                onChange={(e) => patch('address', 'sendOtherDocs', e.target.checked)}
              />
              寄送其他文件
            </label>
          </FormField>
          <FormField label="省" required>
            <TextInput
              value={draft.address.province}
              onChange={(v) => {
                patch('address', 'province', v);
                patch('address', 'confirmed', true);
              }}
            />
          </FormField>
          <FormField label="市" required>
            <TextInput
              value={draft.address.city}
              onChange={(v) => {
                patch('address', 'city', v);
                patch('address', 'confirmed', true);
              }}
            />
          </FormField>
          <FormField label="区" required>
            <TextInput
              value={draft.address.district}
              onChange={(v) => {
                patch('address', 'district', v);
                patch('address', 'confirmed', true);
              }}
            />
          </FormField>
          <FormField label="详细地址" required className="customer-confirm-form__field--full">
            <TextInput
              value={draft.address.detailAddress}
              onChange={(v) => {
                patch('address', 'detailAddress', v);
                patch('address', 'confirmed', true);
              }}
            />
          </FormField>
          <FormField label="邮编" required>
            <TextInput
              value={draft.address.zipCode}
              onChange={(v) => patch('address', 'zipCode', v)}
            />
          </FormField>
          <FormField label="地址类型" required>
            <SelectInput
              value={draft.address.addressType}
              options={ADDRESS_TYPE_OPTIONS}
              onChange={(v) => patch('address', 'addressType', v)}
            />
          </FormField>
          <FormField label="邮寄方式" required>
            <SelectInput
              value={draft.address.mailMethod}
              options={MAIL_METHOD_OPTIONS}
              onChange={(v) => patch('address', 'mailMethod', v)}
            />
          </FormField>
        </div>
      </Section>

      {footer}

      {isDone ? (
        <p className="customer-confirm-form__success" role="status">
          {draft.status === CUSTOMER_STATUS.UPDATED
            ? '客户信息已更新，并同步至客户管理页面。已关联至当前合同草稿。'
            : '客户已创建，并同步至客户管理页面。已关联至当前合同草稿。'}
        </p>
      ) : null}
    </div>
  );
}
