import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import {
  TABLE_STATUS,
  SUBMIT_STATUS,
  RECOGNITION_INPUT,
  buildSubmitCheckItemsForSection,
} from '../../data/demoFlowState';
import { useDemoFlow } from '../../context/DemoFlowContext';
import SubmitCheckList from './SubmitCheckList';
import RecognitionProgress from './RecognitionProgress';
import CustomerIndexCard from './CustomerIndexCard';
import { useMockSubmitReview } from '../hooks/useMockSubmitReview';

function badgeMeta(status) {
  if (status === TABLE_STATUS.WRITTEN) {
    return { label: '已写入草稿', className: 'demo-result-index__badge--written' };
  }
  if (status === TABLE_STATUS.CONFIRMED) {
    return { label: '已确认', className: 'demo-result-index__badge--confirmed' };
  }
  return { label: '待确认', className: 'demo-result-index__badge--pending' };
}

function IndexRow({ hint, children, primary = false }) {
  return (
    <div className="demo-result-index__row">
      <p
        className={`demo-result-index__row-hint${
          primary ? ' demo-result-index__row-hint--primary' : ''
        }`}
      >
        {hint}
      </p>
      <div className="demo-result-index__row-actions">{children}</div>
    </div>
  );
}

function submitRowMeta({ submitStatus, isChecking, allPass }) {
  if (submitStatus === SUBMIT_STATUS.SUBMITTED) {
    return {
      hint: '已提交审核，等待系统处理',
      buttonLabel: '已提交审核',
      buttonDisabled: true,
      buttonVariant: 'default',
      buttonClassName: 'demo-result-index__submit-btn demo-result-index__submit-btn--done',
    };
  }
  if (isChecking) {
    return {
      hint: '正在提交审核检查…',
      buttonLabel: '检查中…',
      buttonDisabled: true,
      buttonVariant: 'primary',
      buttonClassName: 'demo-result-index__submit-btn',
    };
  }
  if (submitStatus === SUBMIT_STATUS.CHECKED) {
    if (allPass) {
      return {
        hint: '检查通过，可确认提交审核',
        buttonLabel: '确认提交',
        buttonDisabled: false,
        buttonVariant: 'primary',
        buttonClassName: 'demo-result-index__submit-btn',
      };
    }
    return {
      hint: '检查未通过，请先处理下列问题',
      buttonLabel: '需处理后提交',
      buttonDisabled: true,
      buttonVariant: 'default',
      buttonClassName: 'demo-result-index__submit-btn demo-result-index__submit-btn--blocked',
    };
  }
  return {
    hint: '内容已写入系统草稿，可提交审核',
    buttonLabel: '提交审核',
    buttonDisabled: false,
    buttonVariant: 'primary',
    buttonClassName: 'demo-result-index__submit-btn',
  };
}

function IndexCard({
  section,
  title,
  desc,
  status,
  viewPath,
  downloadName,
  confirmHint,
  writtenHint,
  flowActionView,
  flowActionDownload,
  flowActionWrite,
  flowActionSubmit,
  submitStatus,
  onWriteDraft,
  onCheckComplete,
  onConfirmSubmit,
}) {
  const navigate = useNavigate();
  const { state } = useDemoFlow();
  const badge = badgeMeta(status);
  const isPending = status === TABLE_STATUS.PENDING;
  const isConfirmed = status === TABLE_STATUS.CONFIRMED;
  const isWritten = status === TABLE_STATUS.WRITTEN;
  const draftHint = isWritten ? writtenHint : confirmHint;

  const checkItems = useMemo(
    () => buildSubmitCheckItemsForSection(section, state),
    [section, state]
  );
  const allPass = checkItems.every((item) => item.pass);
  const showCheckResult =
    submitStatus === SUBMIT_STATUS.CHECKED || submitStatus === SUBMIT_STATUS.SUBMITTED;

  const mockSubmit = useMockSubmitReview({ onComplete: onCheckComplete });

  const handleSubmitClick = useCallback(() => {
    if (submitStatus === SUBMIT_STATUS.SUBMITTED || mockSubmit.isRunning) return;
    if (submitStatus === SUBMIT_STATUS.CHECKED) {
      if (allPass) onConfirmSubmit();
      return;
    }
    mockSubmit.start();
  }, [submitStatus, mockSubmit, allPass, onConfirmSubmit]);

  const submitMeta = submitRowMeta({
    submitStatus,
    isChecking: mockSubmit.isRunning,
    allPass,
  });

  return (
    <div className="demo-result-index__card">
      <div className="demo-result-index__card-head">
        <strong className="demo-result-index__card-title">{title}</strong>
        <span className={`demo-result-index__badge ${badge.className}`}>{badge.label}</span>
      </div>

      <div className="demo-result-index__card-body">
        <IndexRow hint={desc} primary>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            data-flow-action={flowActionDownload}
            onClick={() => window.alert(`[Demo] 下载 ${downloadName}`)}
          >
            下载
          </Button>
          <Button
            variant={isPending ? 'primary' : 'ghost'}
            size="sm"
            type="button"
            data-flow-action={flowActionView}
            onClick={() => navigate(viewPath)}
          >
            {isPending ? '查看/确认' : '查看已确认内容'}
          </Button>
        </IndexRow>

        <IndexRow hint={draftHint}>
          {isWritten ? (
            <Button
              variant="default"
              size="sm"
              type="button"
              className="demo-result-index__write-btn demo-result-index__write-btn--done"
              disabled
            >
              已写入草稿
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              type="button"
              className={`demo-result-index__write-btn${
                isConfirmed ? '' : ' demo-result-index__write-btn--disabled'
              }`}
              data-flow-action={flowActionWrite}
              disabled={!isConfirmed}
              onClick={onWriteDraft}
            >
              写入系统草稿
            </Button>
          )}
        </IndexRow>

        {isWritten ? (
          <>
            <IndexRow hint={submitMeta.hint}>
              <Button
                variant={submitMeta.buttonVariant}
                size="sm"
                type="button"
                className={submitMeta.buttonClassName}
                data-flow-action={
                  submitStatus === SUBMIT_STATUS.CHECKED && allPass
                    ? 'A-P09-001'
                    : flowActionSubmit
                }
                disabled={submitMeta.buttonDisabled}
                onClick={handleSubmitClick}
              >
                {submitMeta.buttonLabel}
              </Button>
            </IndexRow>

            {mockSubmit.isRunning ? (
              <div className="demo-result-index__submit-panel">
                <RecognitionProgress
                  currentStep={mockSubmit.step}
                  progress={mockSubmit.progress}
                />
                <p className="demo-result-index__submit-hint">正在模拟提交审核检查，请稍候…</p>
              </div>
            ) : null}

            {showCheckResult ? (
              <div className="demo-result-index__submit-panel">
                <SubmitCheckList items={checkItems} allPass={allPass} compact />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function ResultIndexPanel() {
  const {
    state,
    writeContractToDraft,
    writeLotToDraft,
    completeContractSubmitCheck,
    completeLotSubmitCheck,
    finalizeContractSubmit,
    finalizeLotSubmit,
    isDraftComplete,
  } = useDemoFlow();

  const isCustomerOnly = state.recognitionInput === RECOGNITION_INPUT.CUSTOMER;

  return (
    <div className="demo-result-index">
      <h3 className="demo-result-index__title">查看索引</h3>
      {isDraftComplete && !isCustomerOnly ? (
        <p className="demo-result-index__complete" role="status">
          系统草稿内容已完整，可进入后续补充或提交审核流程
        </p>
      ) : null}
      <div className="demo-result-index__grid">
        {!isCustomerOnly ? (
          <>
            <IndexCard
              section="contract"
              title="主合同线上表格"
              desc="批量确认 AI 提取的主合同字段"
              status={state.contractTableStatus}
              viewPath="/demo/contract-table"
              downloadName="主合同线上表格.csv"
              confirmHint="确认后，可将主合同内容写入系统草稿"
              writtenHint="主合同内容已写入系统草稿"
              flowActionView="A-P03-001"
              flowActionDownload="A-P03-003"
              flowActionWrite="A-P03-005"
              flowActionSubmit="A-P08-001"
              submitStatus={state.contractSubmitStatus}
              onWriteDraft={writeContractToDraft}
              onCheckComplete={completeContractSubmitCheck}
              onConfirmSubmit={finalizeContractSubmit}
            />
            <IndexCard
              section="lot"
              title="拍品清单线上表格"
              desc="批量确认拍品记录与合同编号归属"
              status={state.lotTableStatus}
              viewPath="/demo/lot-table"
              downloadName="拍品清单线上表格.csv"
              confirmHint="确认后，可将拍品内容写入系统草稿"
              writtenHint="拍品内容已写入系统草稿"
              flowActionView="A-P03-002"
              flowActionDownload="A-P03-004"
              flowActionWrite="A-P03-006"
              flowActionSubmit="A-P08-001"
              submitStatus={state.lotSubmitStatus}
              onWriteDraft={writeLotToDraft}
              onCheckComplete={completeLotSubmitCheck}
              onConfirmSubmit={finalizeLotSubmit}
            />
          </>
        ) : null}
        <CustomerIndexCard />
      </div>
    </div>
  );
}
