import { FLOW_STEPS } from '../constants';

/**
 * P01–P08 流程进度
 * @param {string} currentStepId - 当前步骤 id，如 P04
 * @param {{ id: string, label: string }[]} steps - 默认 FLOW_STEPS
 */
export default function StepProgress({ currentStepId, steps = FLOW_STEPS, className = '' }) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <nav className={`ui-step-progress ${className}`.trim()} aria-label="流程进度">
      <div className="ui-step-progress__track">
        {steps.map((step, index) => {
          const done = currentIndex >= 0 && index < currentIndex;
          const current = step.id === currentStepId;
          const itemClass = [
            'ui-step-progress__item',
            done && 'ui-step-progress__item--done',
            current && 'ui-step-progress__item--current',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={step.id} style={{ display: 'contents' }}>
              {index > 0 ? (
                <div
                  className={[
                    'ui-step-progress__connector',
                    done && 'ui-step-progress__connector--done',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden
                />
              ) : null}
              <div className={itemClass} title={step.label}>
                <span className="ui-step-progress__dot">{step.id.replace('P', '')}</span>
                <span className="ui-step-progress__label">{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
