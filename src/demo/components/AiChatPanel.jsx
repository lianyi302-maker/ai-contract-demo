import { useState, useCallback } from 'react';
import { Button } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import {
  RECOGNITION_STATUS,
  RECOGNITION_INPUT,
  recognitionSteps,
  customerRecognitionSteps,
} from '../../data/demoFlowState';
import ResultIndexPanel from './ResultIndexPanel';
import UploadMaterialsCard from './UploadMaterialsCard';
import CustomerUploadSection from './CustomerUploadSection';
import LotAgreementCard from './LotAgreementCard';
import RecognitionProgress from './RecognitionProgress';
import { useMockRecognition } from '../hooks/useMockRecognition';

const WELCOME_ID = 'welcome';
const WELCOME_TEXT =
  '您好，我是 AI 合同录入助手。您可以让我帮您录入纸质主合同和拍品清单，并生成系统草稿。';

const UPLOAD_TRIGGERS = ['上传', '录入', '纸质合同', '拍品清单', '生成系统草稿'];

const COMPOSER_ACTIONS = [
  { key: 'contract', label: '录入合同', flowAction: 'A-P01-001' },
  { key: 'lot', label: '录入拍品清单' },
  { key: 'customer', label: '上传客户证件', flowAction: 'A-P01-002' },
  { key: 'agreement', label: '创建拍品协议' },
];

function shouldStartUpload(text) {
  const t = text.toLowerCase();
  return UPLOAD_TRIGGERS.some((k) => t.includes(k));
}

function appendUploadMaterialsMessages(addMessage) {
  addMessage({
    role: 'assistant',
    type: 'text',
    content: '好的，请在下方上传纸质主合同与拍品清单，完成后点击开始识别。',
  });
  addMessage({
    role: 'assistant',
    type: 'uploadMaterials',
    content: '',
  });
}

function uploadModeFromMessageType(type) {
  if (type === 'uploadContract') return 'contract';
  if (type === 'uploadLot') return 'lot';
  return 'both';
}

function isUploadMessageType(type) {
  return (
    type === 'uploadMaterials' ||
    type === 'uploadContract' ||
    type === 'uploadLot' ||
    type === 'uploadCard' ||
    (type === 'action' && false)
  );
}

export default function AiChatPanel({ className = '' }) {
  const {
    state,
    addMessage,
    completeUpload,
    completeRecognition,
    setCustomerUploadGroups,
    completeCustomerUpload,
    startContractUploadFlow,
    startLotUploadFlow,
    startLotAgreementFlow,
    startCustomerUploadFlow,
    beginRecognition,
  } = useDemoFlow();
  const [input, setInput] = useState('');
  const [recognizingMode, setRecognizingMode] = useState(null);

  const summary = state.recognitionSummary;
  const threadMessages = state.chatMessages.filter((m) => m.id !== WELCOME_ID);

  const onRecognitionComplete = useCallback(() => {
    completeRecognition();
    setRecognizingMode(null);
  }, [completeRecognition]);

  const recognition = useMockRecognition({ onComplete: onRecognitionComplete });

  const cardDisabled =
    recognition.isRunning || state.recognitionStatus === RECOGNITION_STATUS.DONE;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage({ role: 'user', type: 'text', content: text });
    setInput('');

    if (shouldStartUpload(text)) {
      setTimeout(() => {
        appendUploadMaterialsMessages(addMessage);
      }, 400);
    } else {
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          type: 'text',
          content: '您可以点击下方快捷入口，或输入「帮我录入这批纸质合同和拍品清单」开始上传识别流程。',
        });
      }, 400);
    }
  };

  const handleComposerAction = (key) => {
    if (recognition.isRunning) return;

    if (key === 'contract') {
      addMessage({ role: 'user', type: 'text', content: '录入合同' });
      startContractUploadFlow();
      return;
    }
    if (key === 'lot') {
      addMessage({ role: 'user', type: 'text', content: '录入拍品清单' });
      startLotUploadFlow();
      return;
    }
    if (key === 'customer') {
      addMessage({ role: 'user', type: 'text', content: '上传客户证件' });
      startCustomerUploadFlow();
      return;
    }
    if (key === 'agreement') {
      addMessage({ role: 'user', type: 'text', content: '创建拍品协议' });
      startLotAgreementFlow();
    }
  };

  const handleStartRecognition = (files) => {
    setRecognizingMode('contract');
    beginRecognition(RECOGNITION_INPUT.CONTRACT);
    completeUpload(files);
    recognition.start(recognitionSteps);
  };

  const handleCustomerUploadAndRecognize = useCallback(
    (groups) => {
      if (recognition.isRunning) return;
      setRecognizingMode('customer');
      beginRecognition(RECOGNITION_INPUT.CUSTOMER);
      completeCustomerUpload(groups);
      completeUpload([]);
      recognition.start(customerRecognitionSteps);
    },
    [recognition, beginRecognition, completeUpload, completeCustomerUpload]
  );

  const isCustomerOnlyResult = state.recognitionInput === RECOGNITION_INPUT.CUSTOMER;
  const activeProgressSteps =
    recognizingMode === 'customer' || isCustomerOnlyResult
      ? customerRecognitionSteps
      : recognitionSteps;

  const uploadCardProps = {
    onStartRecognition: handleStartRecognition,
    customerUploadGroups: state.customerUploadGroups,
    onCustomerUploadGroupsChange: setCustomerUploadGroups,
    onCustomerUploadComplete: completeCustomerUpload,
    disabled: cardDisabled,
  };

  return (
    <div className={`ai-chat-float ${className}`.trim()} role="dialog" aria-label="AI 合同录入助手">
      <div className="ai-chat-float__body">
        <div className="ai-chat-float__messages">
          <div className="ai-chat-float__bubble ai-chat-float__bubble--assistant">{WELCOME_TEXT}</div>

          {threadMessages.map((msg) => {
            if (msg.type === 'uploadCustomerMaterials') {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__bubble--card"
                >
                  <CustomerUploadSection
                    groups={state.customerUploadGroups}
                    onChange={setCustomerUploadGroups}
                    onStartRecognition={handleCustomerUploadAndRecognize}
                    disabled={cardDisabled}
                  />
                </div>
              );
            }
            if (isUploadMessageType(msg.type) || (msg.type === 'action' && msg.content === 'uploadEntry')) {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__bubble--card"
                >
                  <UploadMaterialsCard
                    mode={uploadModeFromMessageType(msg.type)}
                    {...uploadCardProps}
                  />
                </div>
              );
            }
            if (msg.type === 'lotAgreement') {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__bubble--card"
                >
                  <LotAgreementCard disabled={cardDisabled} />
                </div>
              );
            }
            if (msg.type === 'result' && summary) {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant demo-result-summary-panel"
                >
                  <p className="demo-result-summary-panel__title">
                    <strong>识别完成</strong>
                  </p>
                  <ul className="demo-result-summary-list">
                    {!isCustomerOnlyResult ? (
                      <>
                        <li>已识别 {summary.contractCount} 份合同</li>
                        <li>已识别 {summary.lotCount} 条拍品记录</li>
                      </>
                    ) : null}
                    {summary.customerCount ? (
                      <>
                        <li>已识别 {summary.customerCount} 位相关客户</li>
                        <li>
                          {summary.customerIndividual ?? summary.personalCount} 位为个人客户，{' '}
                          {summary.customerEnterprise ?? summary.enterpriseCount} 位为企业客户
                        </li>
                        <li>
                          {summary.customerMissing ?? summary.customerMissingCount} 位客户信息缺失
                        </li>
                        <li>
                          {summary.customerPendingConfirm ?? summary.customerPendingCount} 位客户待确认
                        </li>
                      </>
                    ) : null}
                    {!isCustomerOnlyResult ? (
                      <>
                        <li>{summary.missing} 个字段缺失</li>
                        <li>{summary.lowConfidence} 个字段低置信度</li>
                        <li>{summary.contractNoIssues} 条拍品需要确认合同编号</li>
                      </>
                    ) : null}
                  </ul>
                </div>
              );
            }
            if (msg.type === 'bothReady' || msg.type === 'draftComplete') {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__status-bar"
                >
                  {msg.content}
                </div>
              );
            }
            if (msg.type === 'submitCheck') {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__status-bar"
                >
                  {msg.content}
                </div>
              );
            }
            const isStatusBar =
              msg.role === 'assistant' &&
              msg.type === 'text' &&
              /已确认|已写入|草稿/.test(msg.content || '');

            return (
              <div
                key={msg.id}
                className={`ai-chat-float__bubble ai-chat-float__bubble--${msg.role}${
                  isStatusBar ? ' ai-chat-float__status-bar' : ''
                }`}
              >
                {msg.content}
              </div>
            );
          })}

          {recognition.isRunning ? (
            <div
              className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__bubble--card"
              data-flow-action="A-P02-002"
            >
              <RecognitionProgress
                currentStep={recognition.step}
                progress={recognition.progress}
                steps={activeProgressSteps}
              />
              <p className="upload-materials-card__recognizing-hint">正在模拟识别，请稍候…</p>
            </div>
          ) : null}

          {state.recognitionStatus === RECOGNITION_STATUS.DONE && summary ? (
            <div className="ai-chat-float__index">
              <ResultIndexPanel />
            </div>
          ) : null}
        </div>

        <div className="ai-chat-float__composer">
          <div className="ai-chat-float__composer-actions" role="toolbar" aria-label="快捷入口">
            {COMPOSER_ACTIONS.map((action) => (
              <button
                key={action.key}
                type="button"
                className="ai-chat-float__composer-action"
                data-flow-action={action.flowAction}
                disabled={recognition.isRunning}
                onClick={() => handleComposerAction(action.key)}
              >
                {action.label}
              </button>
            ))}
          </div>
          <div className="ai-chat-float__composer-row">
            <input
              className="ai-chat-float__input"
              type="text"
              value={input}
              placeholder="例如：帮我录入这批纸质合同和拍品清单"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              aria-label="对话输入"
              disabled={recognition.isRunning}
            />
            <Button variant="primary" type="button" onClick={handleSend} disabled={recognition.isRunning}>
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
