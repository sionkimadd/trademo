export function scheduleMinuteInterval(
    callback: () => void,
    onCleanup?: (timeoutId: ReturnType<typeof setTimeout> | null, intervalId: ReturnType<typeof setInterval> | null) => void
): () => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const now = new Date();
    const secondsToNextMinute = 60 - now.getSeconds();
    const millisecondsToNextMinute = secondsToNextMinute * 1000 - now.getMilliseconds();

    callback();

    timeoutId = setTimeout(() => {
        callback();
        intervalId = setInterval(callback, 60000);
    }, millisecondsToNextMinute);

    return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
        if (onCleanup) onCleanup(timeoutId, intervalId);
    };
} 