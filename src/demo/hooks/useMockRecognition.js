import { useCallback, useEffect, useState } from 'react';
import { recognitionSteps } from '../../data/demoFlowState';

/**
 * Mock 识别进度（上传页 / AI 浮层共用）
 * @param {object} options
 * @param {() => void} [options.onComplete]
 * @param {number} [options.stepMs]
 * @param {typeof recognitionSteps} [options.steps] 默认全量步骤；start(steps) 可覆盖
 */
export function useMockRecognition({ onComplete, stepMs = 900, steps: defaultSteps = recognitionSteps }) {
  const [phase, setPhase] = useState('idle');
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState(defaultSteps);

  const start = useCallback(
    (steps = defaultSteps) => {
      setActiveSteps(steps);
      setPhase('running');
      setStep(0);
      setProgress(0);
    },
    [defaultSteps]
  );

  const reset = useCallback(() => {
    setPhase('idle');
    setStep(0);
    setProgress(0);
    setActiveSteps(defaultSteps);
  }, [defaultSteps]);

  useEffect(() => {
    if (phase !== 'running') return undefined;

    if (step >= activeSteps.length) {
      const t = setTimeout(() => {
        onComplete?.();
        setPhase('idle');
      }, 600);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setProgress(((step + 1) / activeSteps.length) * 100);
    }, stepMs);

    return () => clearTimeout(t);
  }, [phase, step, onComplete, stepMs, activeSteps.length]);

  const currentStep = Math.min(step, Math.max(activeSteps.length - 1, 0));

  return {
    phase,
    step: currentStep,
    progress,
    isRunning: phase === 'running',
    start,
    reset,
    steps: activeSteps,
  };
}
