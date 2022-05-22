import { useEffect, useState } from 'react';

const TIME_INTERVAL = 1 * 1000; // 1 second

export const useTimer = () => {
    const [duration, setDuration] = useState(-1);
    const [isPreStart, setIsPreStart] = useState(true);
    const [isCounting, setIsCounting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const start = (duration: number) => {
        setDuration(duration);
        setIsPreStart(false);
        setIsCounting(true);
        setIsFinished(false);
    };

    const reset = () => {
        setIsPreStart(true);
        setIsCounting(false);
        setIsFinished(false);
    };

    // Time is up
    useEffect(() => {
        if (isCounting && duration <= 0) {
            setIsPreStart(false);
            setIsCounting(false);
            setIsFinished(true);
        }
    }, [duration, isCounting]);

    useEffect(() => {
        if (!isCounting) return;
        const intervalId = setInterval(() => {
            setDuration(duration => duration - 1);
        }, TIME_INTERVAL);
        return () => {
            clearInterval(intervalId);
        };
    }, [duration, isCounting]);

    return {
        start,
        reset,
        duration,
        isPreStart,
        isFinished,
        isCounting,
    } as const;
};
