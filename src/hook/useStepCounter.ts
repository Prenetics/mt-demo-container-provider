import { useState } from 'react';

export const useStepCounter = (totalSteps: number, initialStep: number) => {
    const [step, setStep] = useState(initialStep);

    const increment = () => {
        setStep(Math.min(step + 1, totalSteps));
    };

    const goTo = (step: number) => {
        setStep(Math.min(step, totalSteps));
    };

    return {
        step,
        totalSteps,
        percentage: parseFloat(((step === 0 ? 0.03 : step / totalSteps) * 100).toFixed(1)),
        increment,
        goTo,
        isFirstStep: step === 0,
        isLastStep: step === totalSteps,
    } as const;
};
