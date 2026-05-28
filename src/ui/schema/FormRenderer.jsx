import { mainContractSchema } from '../../schemas/mainContractSchema';
import {
  evaluateVisibleWhen,
  getDraftValue,
  getDraftStatus,
  getDraftHint,
  FIELD_TYPE,
} from '../../schemas/shared';
import SectionCard from './SectionCard';
import ContractContentRenderer from './ContractContentRenderer';
import EditableField from '../business/EditableField';
import AttachmentPreview from './AttachmentPreview';
import FieldStatusTag from './FieldStatusTag';
import { FIELD_STATUS } from '../constants';

/**
 * 按 mainContractSchema 渲染字段（不含 contractContent 自定义区）
 */
export default function FormRenderer({
  schema = mainContractSchema,
  draftData = {},
  visibleContext,
  onFieldChange,
  readOnly = false,
  renderContent,
}) {
  const context = visibleContext ?? buildVisibleContext(draftData);

  return (
    <>
      {schema.sections.map((section) => {
        if (section.layout === 'custom' && section.schemaRef === 'contractContentSchema') {
          return (
            <SectionCard key={section.key} title={section.label}>
              {renderContent ?? (
                <ContractContentRenderer
                  draftContent={draftData.contractContent || {}}
                  onFieldChange={onFieldChange}
                  onBlockChange={
                    onFieldChange
                      ? (blockKey, val, status) =>
                          onFieldChange('contractContent', blockKey, val, status)
                      : undefined
                  }
                  readOnly={readOnly}
                />
              )}
            </SectionCard>
          );
        }

        const sectionFields = schema.fields.filter((f) => f.section === section.key);
        const visibleFields = sectionFields.filter((f) =>
          evaluateVisibleWhen(f.visibleWhen, context)
        );

        if (!visibleFields.length) return null;

        return (
          <SectionCard key={section.key} title={section.label}>
            <div
              className={
                section.layout === 'grid-2' ? 'ui-contract-form__grid' : 'ui-form-stack'
              }
            >
              {visibleFields.map((field) => {
                const slice = draftData[field.section] || draftData;
                if (field.type === FIELD_TYPE.ATTACHMENT) {
                  const entry = slice[field.key];
                  const files = entry?.value ?? [];
                  return (
                    <div key={field.key} className="ui-form-stack__full">
                      <div className="ui-field__label-row">
                        <span className="ui-field__label">{field.label}</span>
                        <FieldStatusTag status={getDraftStatus(slice, field.key)} />
                      </div>
                      <AttachmentPreview files={files} />
                    </div>
                  );
                }

                if (field.type === FIELD_TYPE.IMAGE_UPLOAD) {
                  const entry = slice[field.key];
                  const files = entry?.value ?? [];
                  return (
                    <div key={field.key} className="ui-form-stack__full">
                      <label className="ui-field__label">{field.label}</label>
                      <AttachmentPreview files={files} emptyText="上传证件照片" />
                    </div>
                  );
                }

                return (
                  <EditableField
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    type={field.type}
                    value={getDraftValue(slice, field.key)}
                    status={getDraftStatus(slice, field.key)}
                    hint={
                      getDraftHint(slice, field.key) ||
                      (field.reserved ? '机构字段 · 第一版预留' : undefined)
                    }
                    options={field.options}
                    required={field.required}
                    placeholder={field.placeholder}
                    readOnly={readOnly || field.reserved}
                    onChange={
                      onFieldChange
                        ? (v) =>
                            onFieldChange(field.section, field.key, v, FIELD_STATUS.MODIFIED)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </SectionCard>
        );
      })}
    </>
  );
}

function buildVisibleContext(draftData) {
  const consignor = draftData.consignorInfo || {};
  const typeEntry = consignor.consignorType;
  const consignorType =
    typeof typeEntry === 'object' ? typeEntry.value : typeEntry || 'personal';
  return { consignorType };
}
