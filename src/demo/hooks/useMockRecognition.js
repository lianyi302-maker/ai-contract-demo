import { useCallback, useEffect, useState } from 'react';
import { recognitionSteps } from '../../data/demoFlowState';

/**
 * Mock 识别进度（上传页 / AI 浮层共用）
 */
export function useMockRecognition({ onComplete, stepMs = 900 }) {
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

    if (step >= recognitionSteps.length) {
      const t = setTimeout(() => {
        onComplete?.();
        setPhase('idle');
      }, 600);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setProgress(((step + 1) / recognitionSteps.length) * 100);
    }, stepMs);

    return () => clearTimeout(t);
  }, [phase, step, onComplete, stepMs]);

  const currentStep = Math.min(step, recognitionSteps.length - 1);

  return {
    phase,
    step: currentStep,
    progress,
    isRunning: phase === 'running',
    start,
    reset,
    steps: recognitionSteps,
  };
}
