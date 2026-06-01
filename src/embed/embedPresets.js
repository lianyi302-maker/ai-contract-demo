import {
  createInitialDemoFlowState,
  computeRecognitionSummaryWithCustomers,
  UPLOAD_STATUS,
  RECOGNITION_STATUS,
  TABLE_STATUS,
  DRAFT_STATUS,
  CUSTOMER_TASK_STATUS,
  initialChatMessages,
  mockContractRows,
  mockLotRows,
} from '../data/demoFlowState';
import { mockCustomers } from '../mock/mockCustomers';

const summary = () =>
  computeRecognitionSummaryWithCustomers(mockContractRows, mockLotRows, mockCustomers);

export const EMBED_PRESET_KEYS = [
  'workbench-init',
  'workbench-indexed',
  'workbench-confirmed',
  'workbench-draft-ready',
  'upload-idle',
  'upload-recognizing',
  'contract-pending',
  'lot-pending',
  'draft-generating',
  'draft-done',
  'submit-check',
  'customer-pending',
];

export function getEmbedPresetState(preset) {
  switch (preset) {
    case 'workbench-init':
      return createInitialDemoFlowState();
    case 'workbench-indexed':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        mockCustomers: structuredClone(mockCustomers),
        customerUploadDone: true,
        chatMessages: [
          ...structuredClone(initialChatMessages),
          {
            id: 'embed-result',
            role: 'assistant',
            type: 'result',
            content: '',
          },
        ],
      };
    case 'workbench-confirmed':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        contractTableStatus: TABLE_STATUS.CONFIRMED,
        lotTableStatus: TABLE_STATUS.CONFIRMED,
        chatMessages: [
          ...structuredClone(initialChatMessages),
          { id: 'embed-result', role: 'assistant', type: 'result', content: '' },
          {
            id: 'embed-both',
            role: 'assistant',
            type: 'bothReady',
            content:
              '主合同与拍品清单均已确认，可分别将对应内容写入同一份系统草稿。',
          },
        ],
      };
    case 'workbench-draft-ready':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        contractTableStatus: TABLE_STATUS.CONFIRMED,
        lotTableStatus: TABLE_STATUS.CONFIRMED,
        draftStatus: DRAFT_STATUS.GENERATED,
        chatMessages: [
          ...structuredClone(initialChatMessages),
          { id: 'embed-result', role: 'assistant', type: 'result', content: '' },
          {
            id: 'embed-both',
            role: 'assistant',
            type: 'bothReady',
            content:
              '主合同与拍品清单均已确认，可分别将对应内容写入同一份系统草稿。',
          },
          {
            id: 'embed-submit',
            role: 'assistant',
            type: 'submitCheck',
            content: '可进入提交审核检查。',
          },
        ],
      };
    case 'upload-idle':
    case 'upload-recognizing':
      return createInitialDemoFlowState();
    case 'contract-pending':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        contractTableStatus: TABLE_STATUS.PENDING,
        lotTableStatus: TABLE_STATUS.PENDING,
      };
    case 'lot-pending':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        contractTableStatus: TABLE_STATUS.CONFIRMED,
        lotTableStatus: TABLE_STATUS.PENDING,
      };
    case 'draft-generating':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        contractTableStatus: TABLE_STATUS.CONFIRMED,
        lotTableStatus: TABLE_STATUS.CONFIRMED,
        draftStatus: DRAFT_STATUS.GENERATING,
      };
    case 'draft-done':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        contractTableStatus: TABLE_STATUS.CONFIRMED,
        lotTableStatus: TABLE_STATUS.CONFIRMED,
        draftStatus: DRAFT_STATUS.GENERATED,
      };
    case 'submit-check':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        contractTableStatus: TABLE_STATUS.CONFIRMED,
        lotTableStatus: TABLE_STATUS.CONFIRMED,
        draftStatus: DRAFT_STATUS.GENERATED,
        mockCustomers: structuredClone(mockCustomers),
        customerTaskStatus: CUSTOMER_TASK_STATUS.PENDING,
        submitCheckStatus: 'ready',
      };
    case 'customer-pending':
      return {
        ...createInitialDemoFlowState(),
        uploadStatus: UPLOAD_STATUS.DONE,
        recognitionStatus: RECOGNITION_STATUS.DONE,
        recognitionSummary: summary(),
        recognitionInput: 'customer',
        mockCustomers: structuredClone(mockCustomers),
        customerTaskStatus: CUSTOMER_TASK_STATUS.PENDING,
        selectedCustomerId: mockCustomers[0]?.id,
      };
    default:
      return createInitialDemoFlowState();
  }
}
