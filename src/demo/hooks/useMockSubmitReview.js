import { useCallback, useEffect, useState } from 'react';
import { submitCheckSteps } from '../../data/demoFlowState';

/**
 * Mock 提交审核检查进度（索引卡片内联）
 */
export function useMockSubmitReview({ onComplete, stepMs = 700 }) {
  const [phase, setPhase] = useState('idle');
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const start = useCallback(() => {
    setPhase('running');
    setStep(0);
    setProgress(0);
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setStep(0);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (phase !== 'running') return undefined;

    if (step >= submitCheckSteps.length) {
      const t = setTimeout(() => {
        onComplete?.();
        setPhase('idle');
      }, 500);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setProgress(((step + 1) / submitCheckSteps.length) * 100);
    }, stepMs);

    return () => clearTimeout(t);
  }, [phase, step, onComplete, stepMs]);

  const currentStep = Math.min(step, submitCheckSteps.length - 1);

  return {
    phase,
    step: currentStep,
    progress,
    isRunning: phase === 'running',
    start,
    reset,
    steps: submitCheckSteps,
  };
}
