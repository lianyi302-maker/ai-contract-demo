import { useState } from 'react';
import { screens } from '../screens';
import { FIELD_STATUS } from '../ui/constants';
import {
  PageHeader,
  StepProgress,
  ActionBar,
  UploadDropzone,
  FileList,
  EditableField,
  ContractInfoForm,
  LotTable,
  DiffPreview,
  ConfirmChecklist,
  AiChatPanel,
  PromptExampleList,
  CommandResultCard,
  GeneratedAgreementCard,
  AiCheckResult,
  ScreenMapView,
  ScreenFrame,
  FlowArrow,
  ScreenMetaPanel,
  ExportToolbar,
  FieldStatusBadge,
  Button,
} from '../ui';
import { lotColumnsSchema } from '../schemas/lotColumnsSchema';
import { SchemaLotTable } from '../ui';
import { lotListDraft } from '../mock/lotListDraft';
import {
  mockFiles,
  mockContractFields,
  mockDiffItems,
  mockConfirmItems,
  mockChatMessages,
  mockPromptExamples,
  mockCommandResult,
  mockAgreementDraft,
  mockAiCheckItems,
} from '../mock';

function GallerySection({ title, desc, children }) {
  return (
    <section className="ui-gallery__section">
      <h2 className="ui-gallery__section-title">{title}</h2>
      {desc ? <p className="ui-gallery__section-desc">{desc}</p> : null}
      {children}
    </section>
  );
}

function GalleryBlock({ title, children }) {
  return (
    <div className="ui-gallery__block">
      {title ? <h3 className="ui-gallery__block-title">{title}</h3> : null}
      {children}
    </div>
  );
}

export default function ComponentGallery() {
  const [currentStep, setCurrentStep] = useState('P04');
  const [files, setFiles] = useState(mockFiles);
  const [contractFields, setContractFields] = useState(mockContractFields);
  const [confirmItems, setConfirmItems] = useState(mockConfirmItems);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(mockChatMessages);

  return (
    <div className="ui-gallery">
      <PageHeader
        title="Component Gallery"
        description="AI 合同录入助手 Demo · 轻量组件库预览（数据均为 mock）"
        status={<span className="ui-badge ui-badge--neutral">交互原型</span>}
        actions={[{ label: '返回原型', variant: 'ghost', onClick: () => window.location.assign('/prototype') }]}
      />

      <p className="ui-gallery__intro">
        字段状态：
        {Object.values(FIELD_STATUS).map((s) => (
          <FieldStatusBadge key={s} status={s} />
        ))}
      </p>

      <GallerySection title="一、布局组件" desc="AppShell 见站点顶栏；以下为页面内布局件。">
        <GalleryBlock title="PageHeader">
          <PageHeader
            title="主合同信息确认"
            description="核对 AI 抽取结果，修正后进入拍品清单确认。"
            status={<span className="ui-badge ui-badge--low">2 项待核对</span>}
            actions={[
              { label: '保存草稿', variant: 'default' },
              { label: '下一步', variant: 'primary' },
            ]}
          />
        </GalleryBlock>

        <GalleryBlock title="StepProgress">
          <div className="ui-gallery__row" style={{ marginBottom: 12 }}>
            {['P01', 'P04', 'P08'].map((id) => (
              <Button
                key={id}
                size="sm"
                variant={currentStep === id ? 'primary' : 'default'}
                type="button"
                onClick={() => setCurrentStep(id)}
              >
                当前 {id}
              </Button>
            ))}
          </div>
          <StepProgress currentStepId={currentStep} />
        </GalleryBlock>

        <GalleryBlock title="ActionBar">
          <div className="ui-card-surface" style={{ padding: 0, overflow: 'hidden' }}>
            <ActionBar
              hint="请先完成必填项核对"
              actions={[
                { label: '上一步', variant: 'default' },
                { label: '保存并继续', variant: 'primary' },
              ]}
            />
          </div>
        </GalleryBlock>
      </GallerySection>

      <GallerySection title="二、业务组件" desc="上传、表单、表格、差异与确认清单。">
        <GalleryBlock title="UploadDropzone + FileList">
          <div className="ui-gallery__stack">
            <UploadDropzone onClick={() => {}} />
            <FileList
              files={files}
              onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
            />
          </div>
        </GalleryBlock>

        <GalleryBlock title="EditableField — 四种状态">
          <div className="ui-contract-form__grid">
            <EditableField label="正常字段" value="中国嘉德国际拍卖有限公司" status={FIELD_STATUS.NORMAL} readOnly />
            <EditableField label="缺失字段" value="" status={FIELD_STATUS.MISSING} placeholder="待填写" />
            <EditableField label="低置信度" value="1,280,000.00" status={FIELD_STATUS.LOW_CONFIDENCE} />
            <EditableField
              label="冲突字段"
              value="91110000XXXX"
              status={FIELD_STATUS.CONFLICT}
              hint="与系统客户档案不一致"
            />
          </div>
        </GalleryBlock>

        <GalleryBlock title="ContractInfoForm">
          <ContractInfoForm
            fields={contractFields}
            onFieldChange={(key, value) =>
              setContractFields((prev) =>
                prev.map((f) => (f.key === key ? { ...f, value } : f))
              )
            }
          />
        </GalleryBlock>

        <GalleryBlock title="LotTable（旧版简化）">
          <LotTable rows={[]} emptyText="请使用 Schema Demo 查看完整拍品表" />
        </GalleryBlock>
        <GalleryBlock title="SchemaLotTable（schema 驱动）">
          <SchemaLotTable
            columns={lotColumnsSchema.columns.slice(0, 8)}
            rows={lotListDraft.lots.slice(0, 2)}
          />
        </GalleryBlock>

        <GalleryBlock title="DiffPreview">
          <DiffPreview items={mockDiffItems} />
        </GalleryBlock>

        <GalleryBlock title="ConfirmChecklist">
          <ConfirmChecklist
            items={confirmItems}
            onToggle={(id, checked) =>
              setConfirmItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, checked } : item))
              )
            }
          />
        </GalleryBlock>
      </GallerySection>

      <GallerySection title="三、AI 组件" desc="对话、指令示例、结果卡与检查。">
        <div className="ui-gallery__split">
          <div className="ui-gallery__stack">
            <GalleryBlock title="PromptExampleList">
              <PromptExampleList
                examples={mockPromptExamples}
                onSelect={(text) => setChatInput(text)}
              />
            </GalleryBlock>
            <GalleryBlock title="CommandResultCard">
              <CommandResultCard {...mockCommandResult} />
            </GalleryBlock>
            <GalleryBlock title="GeneratedAgreementCard">
              <GeneratedAgreementCard
                {...mockAgreementDraft}
                onCopy={() => {}}
                onDownload={() => {}}
              />
            </GalleryBlock>
            <GalleryBlock title="AiCheckResult">
              <AiCheckResult
                missing={mockAiCheckItems.missing}
                errors={mockAiCheckItems.errors}
              />
            </GalleryBlock>
          </div>
          <GalleryBlock title="AiChatPanel">
            <div className="ui-card-surface" style={{ padding: 0, height: 480 }}>
              <AiChatPanel
                messages={messages}
                inputValue={chatInput}
                onInputChange={setChatInput}
                onSend={() => {
                  if (!chatInput.trim()) return;
                  setMessages((prev) => [
                    ...prev,
                    { id: `u-${Date.now()}`, role: 'user', content: chatInput },
                    {
                      id: `a-${Date.now()}`,
                      role: 'assistant',
                      content: '（Mock）已收到指令，请在 CommandResultCard 查看拟执行变更。',
                    },
                  ]);
                  setChatInput('');
                }}
              />
            </div>
          </GalleryBlock>
        </div>
      </GallerySection>

      <GallerySection title="四、页面地图组件" desc="ScreenMapView 组合画布、卡片、箭头与元信息面板。">
        <GalleryBlock title="ScreenFrame · FlowArrow · ScreenMetaPanel · ExportToolbar">
          <div className="ui-gallery__row" style={{ marginBottom: 16 }}>
            <ScreenFrame
              id="P01"
              name="上传材料"
              path="/p01"
              asLink={false}
              selected
              style={{ position: 'relative', left: 0, top: 0 }}
            />
            <ScreenMetaPanel
              id="P01"
              name="上传材料"
              goal={screens[0].goal}
              mainActions={screens[0].mainActions}
              exceptions={screens[0].exceptions}
              style={{ width: 260 }}
            />
            <ExportToolbar onExportPng={() => {}} onPrintPdf={() => window.print()} />
          </div>
          <svg width={120} height={40} aria-hidden>
            <defs>
              <marker id="gallery-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#bfbfbf" />
              </marker>
            </defs>
            <FlowArrow
              from={{ x: 10, y: 20 }}
              to={{ x: 110, y: 20 }}
              markerId="gallery-arrow"
            />
          </svg>
        </GalleryBlock>

        <GalleryBlock title="ScreenMapView（完整）">
          <ScreenMapView
            screens={screens}
            selectedId="P04"
            onSelectScreen={() => {}}
            showExport
            title={null}
            description={null}
          />
        </GalleryBlock>
      </GallerySection>
    </div>
  );
}
