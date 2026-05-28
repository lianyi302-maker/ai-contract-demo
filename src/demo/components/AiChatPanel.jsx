import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import { useDemoFlow } from '../../context/DemoFlowContext';
import { RECOGNITION_STATUS } from '../../data/demoFlowState';
import ResultIndexPanel from './ResultIndexPanel';
import UploadMaterialsCard from './UploadMaterialsCard';
import RecognitionProgress from './RecognitionProgress';
import { useMockRecognition } from '../hooks/useMockRecognition';

const WELCOME_ID = 'welcome';
const WELCOME_TEXT =
  '您好，我是 AI 合同录入助手。您可以让我帮您录入纸质主合同和拍品清单，并生成系统草稿。';

const UPLOAD_TRIGGERS = ['上传', '录入', '纸质合同', '拍品清单', '生成系统草稿'];

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

export default function AiChatPanel({ className = '' }) {
  const navigate = useNavigate();
  const {
    state,
    addMessage,
    completeUpload,
    completeRecognition,
    canGenerateDraft,
    startDraftGeneration,
  } = useDemoFlow();
  const [input, setInput] = useState('');

  const summary = state.recognitionSummary;
  const threadMessages = state.chatMessages.filter((m) => m.id !== WELCOME_ID);

  const onRecognitionComplete = useCallback(() => {
    completeRecognition();
  }, [completeRecognition]);

  const recognition = useMockRecognition({ onComplete: onRecognitionComplete });

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
          content: '您可以输入「帮我录入这批纸质合同和拍品清单」开始上传识别流程。',
        });
      }, 400);
    }
  };

  const handleEntryContract = () => {
    if (recognition.isRunning) return;
    addMessage({ role: 'user', type: 'text', content: '录入合同' });
    appendUploadMaterialsMessages(addMessage);
  };

  const handleStartAgreement = () => {
    addMessage({ role: 'user', type: 'text', content: '发起协议' });
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        type: 'text',
        content:
          '已收到您的协议发起请求。当前 Demo 优先支持纸质合同与拍品清单录入；协议起草将在正式环境中对接法务模板服务。',
      });
    }, 400);
  };

  const handleStartRecognition = (files) => {
    completeUpload(files);
    recognition.start();
  };

  const handleGenerateDraft = () => {
    if (!canGenerateDraft) return;
    startDraftGeneration();
    navigate('/demo/draft-preview');
  };

  const showQuickActions =
    !recognition.isRunning &&
    state.recognitionStatus !== RECOGNITION_STATUS.DONE &&
    threadMessages.length === 0;

  return (
    <div className={`ai-chat-float ${className}`.trim()} role="dialog" aria-label="AI 合同录入助手">
      <div className="ai-chat-float__body">
        <div className="ai-chat-float__messages">
          <div className="ai-chat-float__bubble ai-chat-float__bubble--assistant">{WELCOME_TEXT}</div>

          {showQuickActions ? (
            <div className="ai-chat-float__quick">
              <button
                type="button"
                className="ai-chat-float__quick-btn"
                data-flow-action="A-P01-001"
                onClick={handleEntryContract}
              >
                录入合同
              </button>
              <button type="button" className="ai-chat-float__quick-btn" onClick={handleStartAgreement}>
                发起协议
              </button>
            </div>
          ) : null}

          {threadMessages.map((msg) => {
            if (msg.type === 'uploadMaterials') {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__bubble--card"
                >
                  <UploadMaterialsCard
                    onStartRecognition={handleStartRecognition}
                    disabled={recognition.isRunning || state.recognitionStatus === RECOGNITION_STATUS.DONE}
                  />
                </div>
              );
            }
            if (msg.type === 'uploadCard' || (msg.type === 'action' && msg.content === 'uploadEntry')) {
              return (
                <div
                  key={msg.id}
                  className="ai-chat-float__bubble ai-chat-float__bubble--assistant ai-chat-float__bubble--card"
                >
                  <UploadMaterialsCard
                    onStartRecognition={handleStartRecognition}
                    disabled={recognition.isRunning || state.recognitionStatus === RECOGNITION_STATUS.DONE}
                  />
                </div>
              );
            }
            if (msg.type === 'result' && summary) {
              return (
                <div key={msg.id} className="ai-chat-float__bubble ai-chat-float__bubble--assistant">
                  <p>
                    <strong>识别完成</strong>
                  </p>
                  <ul className="demo-result-summary-list">
                    <li>已识别 {summary.contractCount} 份合同</li>
                    <li>已识别 {summary.lotCount} 条拍品记录</li>
                    <li>{summary.missing} 个字段缺失</li>
                    <li>{summary.lowConfidence} 个字段低置信度</li>
                    <li>{summary.contractNoIssues} 条拍品需要确认合同编号</li>
                  </ul>
                </div>
              );
            }
            if (msg.type === 'bothReady') {
              return (
                <div key={msg.id} className="ai-chat-float__bubble ai-chat-float__bubble--assistant">
                  {msg.content}
                </div>
              );
            }
            if (msg.type === 'submitCheck') {
              return (
                <div key={msg.id} className="ai-chat-float__bubble ai-chat-float__bubble--assistant">
                  <p>{msg.content}</p>
                  <Button
                    variant="primary"
                    type="button"
                    size="sm"
                    data-flow-action="A-P08-001"
                    onClick={() => navigate('/demo/submit-check')}
                  >
                    提交审核检查
                  </Button>
                </div>
              );
            }
            return (
              <div
                key={msg.id}
                className={`ai-chat-float__bubble ai-chat-float__bubble--${msg.role}`}
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
              />
              <p className="upload-materials-card__recognizing-hint">正在模拟识别，请稍候…</p>
            </div>
          ) : null}

          {state.recognitionStatus === RECOGNITION_STATUS.DONE && summary ? (
            <div className="ai-chat-float__index">
              <ResultIndexPanel
                contractTableStatus={state.contractTableStatus}
                lotTableStatus={state.lotTableStatus}
                draftStatus={state.draftStatus}
                canGenerateDraft={canGenerateDraft}
                onGenerateDraft={handleGenerateDraft}
              />
            </div>
          ) : null}
        </div>

        <div className="ai-chat-float__composer">
          <input
            className="ai-chat-float__input"
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
  );
}
