import { recognitionSteps } from '../../data/demoFlowState';

export default function RecognitionProgress({ currentStep = 0, progress = 0 }) {
  return (
    <div className="demo-recognition-progress">
      <div className="demo-recognition-progress__bar">
        <div className="demo-recognition-progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <ul className="demo-recognition-progress__steps">
        {recognitionSteps.map((step, index) => {
          const done = index < currentStep;
          const active = index === currentStep;
          return (
            <li
              key={step.key}
              className={[
                'demo-recognition-progress__step',
                done && 'demo-recognition-progress__step--done',
                active && 'demo-recognition-progress__step--active',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {step.label}
              {done ? ' ✓' : active ? ' …' : ''}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
