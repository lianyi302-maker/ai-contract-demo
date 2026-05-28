import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import {
  createInitialDemoFlowState,
  computeRecognitionSummary,
  UPLOAD_STATUS,
  RECOGNITION_STATUS,
  TABLE_STATUS,
  DRAFT_STATUS,
  initialChatMessages,
} from '../data/demoFlowState';

const DemoFlowContext = createContext(null);

export function DemoFlowProvider({ children, initialState: initialStateProp }) {
  const [state, setState] = useState(
    () => initialStateProp ?? createInitialDemoFlowState()
  );

  const addMessage = useCallback((msg) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { id: `m-${Date.now()}`, ...msg }],
    }));
  }, []);

  const updateMessage = useCallback((id, patch) => {
    setState((prev) => ({
      ...prev,
      chatMessages: prev.chatMessages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }, []);

  const setContractRows = useCallback((rows) => {
    setState((prev) => ({ ...prev, mockContractRows: rows }));
  }, []);

  const setLotRows = useCallback((rows) => {
    setState((prev) => ({ ...prev, mockLotRows: rows }));
  }, []);

  const startUploadFlow = useCallback(() => {
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
  }, [addMessage]);

  const completeUpload = useCallback((files) => {
    setState((prev) => ({
      ...prev,
      uploadStatus: UPLOAD_STATUS.DONE,
      uploadedFiles: files,
    }));
  }, []);

  const completeRecognition = useCallback(() => {
    setState((prev) => {
      const summary = computeRecognitionSummary(prev.mockContractRows, prev.mockLotRows);
      return {
        ...prev,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary,
        contractTableStatus: TABLE_STATUS.PENDING,
        lotTableStatus: TABLE_STATUS.PENDING,
        draftStatus: DRAFT_STATUS.NONE,
      };
    });
    addMessage({
      role: 'assistant',
      type: 'result',
      content: '', // filled by component from summary
    });
  }, [addMessage]);

  const appendBothReadyIfNeeded = (messages, contractStatus, lotStatus) => {
    if (
      contractStatus === TABLE_STATUS.CONFIRMED &&
      lotStatus === TABLE_STATUS.CONFIRMED &&
      !messages.some((m) => m.type === 'bothReady')
    ) {
      return [
        ...messages,
        {
          id: `both-${Date.now()}`,
          role: 'assistant',
          type: 'bothReady',
          content: '主合同线上表格已确认，拍品清单已确认，可以生成系统草稿。',
        },
      ];
    }
    return messages;
  };

  const confirmContractTable = useCallback(() => {
    setState((prev) => {
      const contractTableStatus = TABLE_STATUS.CONFIRMED;
      let chatMessages = [
        ...prev.chatMessages,
        {
          id: `cc-${Date.now()}`,
          role: 'assistant',
          type: 'text',
          content: '主合同线上表格已确认。',
        },
      ];
      chatMessages = appendBothReadyIfNeeded(
        chatMessages,
        contractTableStatus,
        prev.lotTableStatus
      );
      return { ...prev, contractTableStatus, chatMessages };
    });
  }, []);

  const confirmLotTable = useCallback(() => {
    setState((prev) => {
      const lotTableStatus = TABLE_STATUS.CONFIRMED;
      let chatMessages = [
        ...prev.chatMessages,
        {
          id: `lc-${Date.now()}`,
          role: 'assistant',
          type: 'text',
          content: '拍品清单线上表格已确认。',
        },
      ];
      chatMessages = appendBothReadyIfNeeded(
        chatMessages,
        prev.contractTableStatus,
        lotTableStatus
      );
      return { ...prev, lotTableStatus, chatMessages };
    });
  }, []);

  const startDraftGeneration = useCallback(() => {
    setState((prev) => ({ ...prev, draftStatus: DRAFT_STATUS.GENERATING }));
  }, []);

  const completeDraftGeneration = useCallback(() => {
    setState((prev) => ({ ...prev, draftStatus: DRAFT_STATUS.GENERATED }));
    addMessage({
      role: 'assistant',
      type: 'text',
      content: '系统草稿已生成，请在提交审核前完成检查。',
    });
    addMessage({
      role: 'assistant',
      type: 'submitCheck',
      content: '可进入提交审核检查。',
    });
  }, [addMessage]);

  const resetDemo = useCallback(() => {
    setState(createInitialDemoFlowState());
  }, []);

  const canGenerateDraft =
    state.contractTableStatus === TABLE_STATUS.CONFIRMED &&
    state.lotTableStatus === TABLE_STATUS.CONFIRMED;

  const value = useMemo(
    () => ({
      state,
      setState,
      addMessage,
      updateMessage,
      setContractRows,
      setLotRows,
      startUploadFlow,
      completeUpload,
      completeRecognition,
      confirmContractTable,
      confirmLotTable,
      startDraftGeneration,
      completeDraftGeneration,
      resetDemo,
      canGenerateDraft,
      UPLOAD_STATUS,
      RECOGNITION_STATUS,
      TABLE_STATUS,
      DRAFT_STATUS,
    }),
    [
      state,
      addMessage,
      updateMessage,
      setContractRows,
      setLotRows,
      startUploadFlow,
      completeUpload,
      completeRecognition,
      confirmContractTable,
      confirmLotTable,
      startDraftGeneration,
      completeDraftGeneration,
      resetDemo,
      canGenerateDraft,
    ]
  );

  return <DemoFlowContext.Provider value={value}>{children}</DemoFlowContext.Provider>;
}

export function useDemoFlow() {
  const ctx = useContext(DemoFlowContext);
  if (!ctx) throw new Error('useDemoFlow must be used within DemoFlowProvider');
  return ctx;
}

export { initialChatMessages };
