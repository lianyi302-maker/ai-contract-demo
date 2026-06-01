import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import {
  createInitialDemoFlowState,
  computeRecognitionSummaryWithCustomers,
  computeCustomerTaskStatus,
  computeCustomerSummary,
  UPLOAD_STATUS,
  RECOGNITION_STATUS,
  TABLE_STATUS,
  DRAFT_STATUS,
  SUBMIT_STATUS,
  CUSTOMER_STATUS,
  CUSTOMER_TASK_STATUS,
  RECOGNITION_INPUT,
  initialChatMessages,
} from '../data/demoFlowState';
import { mockCustomers, createCustomerUploadGroup } from '../mock/mockCustomers';
import { deriveCustomerStatus } from '../demo/utils/customerConfirmUtils';

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

  const startContractUploadFlow = useCallback(() => {
    addMessage({
      role: 'assistant',
      type: 'text',
      content: '好的，请在下方上传纸质主合同，完成后点击开始识别。',
    });
    addMessage({
      role: 'assistant',
      type: 'uploadContract',
      content: '',
    });
  }, [addMessage]);

  const startLotUploadFlow = useCallback(() => {
    addMessage({
      role: 'assistant',
      type: 'text',
      content: '好的，请在下方上传拍品清单，完成后点击开始识别。',
    });
    addMessage({
      role: 'assistant',
      type: 'uploadLot',
      content: '',
    });
  }, [addMessage]);

  const startLotAgreementFlow = useCallback(() => {
    addMessage({
      role: 'assistant',
      type: 'text',
      content: '请在下方案例中选择关联合同并创建拍品协议。',
    });
    addMessage({
      role: 'assistant',
      type: 'lotAgreement',
      content: '',
    });
  }, [addMessage]);

  const startCustomerUploadFlow = useCallback(() => {
    addMessage({
      role: 'assistant',
      type: 'text',
      content: '请在下方上传客户证件，完成后点击「开始识别」。',
    });
    addMessage({
      role: 'assistant',
      type: 'uploadCustomerMaterials',
      content: '',
    });
  }, [addMessage]);

  const beginRecognition = useCallback((input) => {
    setState((prev) => ({ ...prev, recognitionInput: input }));
  }, []);

  const completeUpload = useCallback((files) => {
    setState((prev) => ({
      ...prev,
      uploadStatus: UPLOAD_STATUS.DONE,
      uploadedFiles: files,
    }));
  }, []);

  const completeRecognition = useCallback(() => {
    setState((prev) => {
      const customers = structuredClone(mockCustomers);
      const summary = computeRecognitionSummaryWithCustomers(
        prev.mockContractRows,
        prev.mockLotRows,
        customers
      );
      return {
        ...prev,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary,
        mockCustomers: customers,
        customerTaskStatus: computeCustomerTaskStatus(customers),
        selectedCustomerId: customers[0]?.id ?? null,
        contractTableStatus: TABLE_STATUS.PENDING,
        lotTableStatus: TABLE_STATUS.PENDING,
        draftStatus: DRAFT_STATUS.NONE,
      };
    });
    addMessage({
      role: 'assistant',
      type: 'result',
      content: '',
    });
  }, [addMessage]);

  const setCustomerUploadGroups = useCallback((groups) => {
    setState((prev) => ({ ...prev, customerUploadGroups: groups }));
  }, []);

  const updateCustomerUploadGroup = useCallback((groupId, patch) => {
    setState((prev) => ({
      ...prev,
      customerUploadGroups: prev.customerUploadGroups.map((g) =>
        g.id === groupId ? { ...g, ...patch } : g
      ),
    }));
  }, []);

  const removeCustomerUploadGroup = useCallback((groupId) => {
    setState((prev) => ({
      ...prev,
      customerUploadGroups: prev.customerUploadGroups.filter((g) => g.id !== groupId),
    }));
  }, []);

  const addCustomerUploadGroup = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.customerUploadGroups.length + 1;
      return {
        ...prev,
        customerUploadGroups: [
          ...prev.customerUploadGroups,
          createCustomerUploadGroup(nextIndex),
        ],
      };
    });
  }, []);

  const completeCustomerUpload = useCallback((groups) => {
    setState((prev) => ({
      ...prev,
      customerUploadGroups: groups ?? prev.customerUploadGroups,
      customerUploadDone: true,
    }));
  }, []);

  const updateCustomer = useCallback((customerIdOrRecord, patch) => {
    setState((prev) => {
      const isFullRecord =
        typeof customerIdOrRecord === 'object' && customerIdOrRecord?.id && !patch;
      const customerId = isFullRecord ? customerIdOrRecord.id : customerIdOrRecord;
      const changes = isFullRecord ? customerIdOrRecord : patch || {};

      const mockCustomersNext = prev.mockCustomers.map((c) => {
        if (c.id !== customerId) return c;
        const merged = isFullRecord
          ? { ...changes }
          : {
              ...c,
              ...changes,
              account: { ...c.account, ...(changes.account || {}) },
              personal: { ...c.personal, ...(changes.personal || {}) },
              idDocument: { ...c.idDocument, ...(changes.idDocument || {}) },
              address: { ...c.address, ...(changes.address || {}) },
            };
        if (changes.status) {
          merged.status = changes.status;
        } else if (![CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(c.status)) {
          merged.status = deriveCustomerStatus(merged);
        }
        if (merged.personal?.chineseName) {
          merged.name = merged.personal.chineseName;
        }
        return merged;
      });
      return {
        ...prev,
        mockCustomers: mockCustomersNext,
        customerTaskStatus: computeCustomerTaskStatus(mockCustomersNext),
        recognitionSummary: prev.recognitionSummary
          ? {
              ...prev.recognitionSummary,
              ...computeCustomerSummary(mockCustomersNext),
            }
          : prev.recognitionSummary,
      };
    });
  }, []);

  const saveCustomerChanges = useCallback(
    (customerId, patch) => {
      updateCustomer(customerId, patch);
    },
    [updateCustomer]
  );

  const confirmCustomer = useCallback((customerId) => {
    setState((prev) => {
      const target = prev.mockCustomers.find((c) => c.id === customerId);
      if (!target) return prev;
      const nextStatus = target.existingInCrm ? CUSTOMER_STATUS.UPDATED : CUSTOMER_STATUS.CREATED;
      const mockCustomersNext = prev.mockCustomers.map((c) =>
        c.id === customerId ? { ...c, status: nextStatus } : c
      );
      const customerTaskStatus = computeCustomerTaskStatus(mockCustomersNext);
      const feedback = target.existingInCrm
        ? '客户信息已更新，并同步至客户管理页面。已关联至当前合同草稿。'
        : '客户已创建，并同步至客户管理页面。已关联至当前合同草稿。';
      return {
        ...prev,
        mockCustomers: mockCustomersNext,
        customerTaskStatus,
        recognitionSummary: prev.recognitionSummary
          ? {
              ...prev.recognitionSummary,
              ...computeCustomerSummary(mockCustomersNext),
            }
          : prev.recognitionSummary,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: `cust-${Date.now()}`,
            role: 'assistant',
            type: 'text',
            content: `${target.name}：${feedback}`,
          },
        ],
      };
    });
  }, []);

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
          content:
            '主合同与拍品清单均已确认，可分别将对应内容写入同一份系统草稿。',
        },
      ];
    }
    return messages;
  };

  const confirmContractTable = useCallback(() => {
    setState((prev) => {
      if (prev.contractTableStatus === TABLE_STATUS.WRITTEN) return prev;
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
      if (prev.lotTableStatus === TABLE_STATUS.WRITTEN) return prev;
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

  const appendDraftCompleteIfNeeded = (messages, contractStatus, lotStatus) => {
    if (
      contractStatus === TABLE_STATUS.WRITTEN &&
      lotStatus === TABLE_STATUS.WRITTEN &&
      !messages.some((m) => m.type === 'draftComplete')
    ) {
      return [
        ...messages,
        {
          id: `dc-${Date.now()}`,
          role: 'assistant',
          type: 'draftComplete',
          content:
            '系统草稿内容已完整，可进入后续补充或提交审核流程。',
        },
      ];
    }
    return messages;
  };

  const writeContractToDraft = useCallback(() => {
    setState((prev) => {
      if (prev.contractTableStatus !== TABLE_STATUS.CONFIRMED) return prev;
      const contractTableStatus = TABLE_STATUS.WRITTEN;
      let chatMessages = [
        ...prev.chatMessages,
        {
          id: `cw-${Date.now()}`,
          role: 'assistant',
          type: 'text',
          content: '主合同内容已写入系统草稿。',
        },
      ];
      chatMessages = appendDraftCompleteIfNeeded(
        chatMessages,
        contractTableStatus,
        prev.lotTableStatus
      );
      const draftStatus =
        prev.lotTableStatus === TABLE_STATUS.WRITTEN
          ? DRAFT_STATUS.GENERATED
          : prev.draftStatus;
      return { ...prev, contractTableStatus, chatMessages, draftStatus };
    });
  }, []);

  const writeLotToDraft = useCallback(() => {
    setState((prev) => {
      if (prev.lotTableStatus !== TABLE_STATUS.CONFIRMED) return prev;
      const lotTableStatus = TABLE_STATUS.WRITTEN;
      let chatMessages = [
        ...prev.chatMessages,
        {
          id: `lw-${Date.now()}`,
          role: 'assistant',
          type: 'text',
          content: '拍品内容已写入系统草稿。',
        },
      ];
      chatMessages = appendDraftCompleteIfNeeded(
        chatMessages,
        prev.contractTableStatus,
        lotTableStatus
      );
      const draftStatus =
        prev.contractTableStatus === TABLE_STATUS.WRITTEN
          ? DRAFT_STATUS.GENERATED
          : prev.draftStatus;
      return { ...prev, lotTableStatus, chatMessages, draftStatus };
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
      content: '系统草稿已更新，请在提交审核前完成检查。',
    });
    addMessage({
      role: 'assistant',
      type: 'submitCheck',
      content: '可进入提交审核检查。',
    });
  }, [addMessage]);

  const completeContractSubmitCheck = useCallback(() => {
    setState((prev) => ({
      ...prev,
      contractSubmitStatus: SUBMIT_STATUS.CHECKED,
    }));
  }, []);

  const completeLotSubmitCheck = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lotSubmitStatus: SUBMIT_STATUS.CHECKED,
    }));
  }, []);

  const finalizeContractSubmit = useCallback(() => {
    setState((prev) => {
      if (prev.contractSubmitStatus !== SUBMIT_STATUS.CHECKED) return prev;
      return {
        ...prev,
        contractSubmitStatus: SUBMIT_STATUS.SUBMITTED,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: `cs-${Date.now()}`,
            role: 'assistant',
            type: 'text',
            content: '主合同已提交审核。',
          },
        ],
      };
    });
  }, []);

  const finalizeLotSubmit = useCallback(() => {
    setState((prev) => {
      if (prev.lotSubmitStatus !== SUBMIT_STATUS.CHECKED) return prev;
      return {
        ...prev,
        lotSubmitStatus: SUBMIT_STATUS.SUBMITTED,
        chatMessages: [
          ...prev.chatMessages,
          {
            id: `ls-${Date.now()}`,
            role: 'assistant',
            type: 'text',
            content: '拍品清单已提交审核。',
          },
        ],
      };
    });
  }, []);

  const resetDemo = useCallback(() => {
    setState(createInitialDemoFlowState());
  }, []);

  const setSelectedCustomerId = useCallback((id) => {
    setState((prev) => ({ ...prev, selectedCustomerId: id }));
  }, []);

  const isDraftComplete =
    state.contractTableStatus === TABLE_STATUS.WRITTEN &&
    state.lotTableStatus === TABLE_STATUS.WRITTEN;

  const value = useMemo(
    () => ({
      state,
      setState,
      addMessage,
      updateMessage,
      setContractRows,
      setLotRows,
      startUploadFlow,
      startContractUploadFlow,
      startLotUploadFlow,
      startLotAgreementFlow,
      startCustomerUploadFlow,
      beginRecognition,
      setCustomerUploadGroups,
      updateCustomerUploadGroup,
      removeCustomerUploadGroup,
      addCustomerUploadGroup,
      completeCustomerUpload,
      updateCustomer,
      saveCustomerChanges,
      confirmCustomer,
      setSelectedCustomerId,
      completeUpload,
      completeRecognition,
      confirmContractTable,
      confirmLotTable,
      writeContractToDraft,
      writeLotToDraft,
      completeContractSubmitCheck,
      completeLotSubmitCheck,
      finalizeContractSubmit,
      finalizeLotSubmit,
      startDraftGeneration,
      completeDraftGeneration,
      resetDemo,
      isDraftComplete,
      UPLOAD_STATUS,
      RECOGNITION_STATUS,
      TABLE_STATUS,
      DRAFT_STATUS,
      SUBMIT_STATUS,
      CUSTOMER_STATUS,
      CUSTOMER_TASK_STATUS,
      RECOGNITION_INPUT,
    }),
    [
      state,
      addMessage,
      updateMessage,
      setContractRows,
      setLotRows,
      startUploadFlow,
      startContractUploadFlow,
      startLotUploadFlow,
      startLotAgreementFlow,
      startCustomerUploadFlow,
      beginRecognition,
      setCustomerUploadGroups,
      updateCustomerUploadGroup,
      removeCustomerUploadGroup,
      addCustomerUploadGroup,
      completeCustomerUpload,
      updateCustomer,
      saveCustomerChanges,
      confirmCustomer,
      setSelectedCustomerId,
      completeUpload,
      completeRecognition,
      confirmContractTable,
      confirmLotTable,
      writeContractToDraft,
      writeLotToDraft,
      completeContractSubmitCheck,
      completeLotSubmitCheck,
      finalizeContractSubmit,
      finalizeLotSubmit,
      startDraftGeneration,
      completeDraftGeneration,
      resetDemo,
      isDraftComplete,
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
