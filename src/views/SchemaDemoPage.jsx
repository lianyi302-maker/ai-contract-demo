import { useState, useCallback, useMemo } from 'react';
import { contractTabs } from '../schemas/contractTabs';
import { getActionBarConfig } from '../schemas/actionBarSchema';
import { CONSIGNOR_TYPE } from '../schemas/shared';
import {
  PageHeader,
  StepProgress,
  ActionBar,
  FormRenderer,
  LotListView,
  FieldStatusTag,
  EditableField,
  FeeRuleEditor,
  ClauseEditor,
  SectionCard,
} from '../ui';
import { FIELD_STATUS } from '../ui/constants';
import { mainContractDraft } from '../mock/mainContractDraft';
import { lotListDraft } from '../mock/lotListDraft';
import { contractContentSchema, getContentBlock } from '../schemas/contractContentSchema';

function TabBar({ activeKey, onChange }) {
  return (
    <div className="ui-contract-tabs" role="tablist">
      {contractTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeKey === tab.key}
          className={`ui-contract-tabs__item ${activeKey === tab.key ? 'ui-contract-tabs__item--active' : ''}`}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function SchemaDemoPage() {
  const [activeTab, setActiveTab] = useState('mainContract');
  const [draft, setDraft] = useState(() => structuredClone(mainContractDraft));
  const [lotDraft, setLotDraft] = useState(() => structuredClone(lotListDraft));

  const visibleContext = useMemo(
    () => ({
      consignorType: draft.consignorInfo?.consignorType?.value ?? CONSIGNOR_TYPE.PERSONAL,
    }),
    [draft.consignorInfo?.consignorType?.value]
  );

  const handleFieldChange = useCallback((section, key, value, status) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      if (section === 'contractContent') {
        if (!next.contractContent) next.contractContent = {};
        if (['dealFeeRules', 'noDealFeeRules', 'otherFees'].includes(key)) {
          next.contractContent[key] = {
            ...next.contractContent[key],
            value,
            status: status || FIELD_STATUS.MODIFIED,
          };
        } else if (key === 'specialProvisions') {
          next.contractContent[key] = { ...next.contractContent[key], value, status };
        } else {
          const blockKey = Object.keys(next.contractContent).find(
            (bk) => next.contractContent[bk]?.fields?.[key] != null
          );
          if (blockKey) {
            if (!next.contractContent[blockKey].fields) next.contractContent[blockKey].fields = {};
            next.contractContent[blockKey].fields[key] = {
              value,
              status: status || FIELD_STATUS.MODIFIED,
            };
          } else {
            next.contractContent[key] = { value, status: status || FIELD_STATUS.MODIFIED };
          }
        }
        return next;
      }
      if (!next[section]) next[section] = {};
      next[section][key] = {
        ...(next[section][key] || {}),
        value,
        status: status || FIELD_STATUS.MODIFIED,
      };
      return next;
    });
  }, []);

  const mainActionBar = getActionBarConfig('mainContract');
  const currentStep = activeTab === 'lotList' ? 'P05' : 'P04';
  const pageTitle =
    activeTab === 'lotList' ? 'P05 拍品清单确认' : 'P04 主合同信息确认';

  return (
    <div className="ui-schema-demo">
      <PageHeader
        title={pageTitle}
        description="Schema 驱动验证 — 主合同 / 拍品清单 Tab + mock draftData"
        status={<span className="ui-badge ui-badge--neutral">Schema Demo</span>}
      />

      <StepProgress currentStepId={currentStep} />

      <TabBar activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'mainContract' ? (
        <>
          <div className="ui-schema-demo__hint">
            委托人类型：
            <select
              value={visibleContext.consignorType}
              onChange={(e) =>
                handleFieldChange('consignorInfo', 'consignorType', e.target.value, FIELD_STATUS.MODIFIED)
              }
              style={{ marginLeft: 8 }}
            >
              <option value={CONSIGNOR_TYPE.PERSONAL}>个人委托人</option>
              <option value={CONSIGNOR_TYPE.ORGANIZATION}>机构委托人（预留）</option>
            </select>
          </div>

          <FormRenderer
            draftData={draft}
            visibleContext={visibleContext}
            onFieldChange={handleFieldChange}
          />

          <ActionBar
            hint="actionBarSchema.mainContract"
            actions={mainActionBar.actions.map((a) => ({
              label: a.label,
              variant: a.variant,
              onClick: () => window.alert(`[Demo] ${a.key}`),
            }))}
          />
        </>
      ) : null}

      {activeTab === 'lotList' ? (
        <LotListView
          draft={lotDraft}
          onUpdateDraft={(updater) =>
            setLotDraft((prev) => (typeof updater === 'function' ? updater(prev) : updater))
          }
        />
      ) : null}

      {activeTab === 'mainContract' ? (
        <SectionCard
          title="组件状态速览"
          extra={<span className="ui-badge ui-badge--neutral">主合同摘录</span>}
        >
          <div className="ui-gallery__row" style={{ marginBottom: 16 }}>
            {Object.values(FIELD_STATUS).map((s) => (
              <FieldStatusTag key={s} status={s} />
            ))}
          </div>
          <div className="ui-gallery__split">
            <FeeRuleEditor
              label="成交费用（独立预览）"
              feeRuleConfig={getContentBlock('dealFeeRules')?.feeRuleConfig}
              value={draft.contractContent?.dealFeeRules?.value}
              status={draft.contractContent?.dealFeeRules?.status}
              readOnly
            />
            <ClauseEditor
              value={draft.contractContent?.specialProvisions?.value}
              status={draft.contractContent?.specialProvisions?.status}
              readOnly
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <EditableField
              label="冲突示例"
              value="CN-2025-OTHER"
              status={FIELD_STATUS.CONFLICT}
              hint="合同编号与主合同表格不一致"
              readOnly
            />
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
