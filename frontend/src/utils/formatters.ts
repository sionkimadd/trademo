export const formatCurrency = (num: number | undefined): string => {
    if (num === undefined) return 'N/A';
    return num.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
};

export const getReturnRateColor = (rate: number): string => {
    if (rate > 0) return 'text-red-500';
    if (rate < 0) return 'text-blue-500';
    return 'text-gray-400';
};

export const formatPercent = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

export const formatChartNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(2);
};

export const formatChartDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const prepareVolumeData = (data: Array<{ time: any; volume?: number; close: number; open: number }>) => {
    return data
        .filter(item => item.volume && typeof item.volume === 'number' && item.volume > 0)
        .map(item => ({
            time: item.time,
            value: item.volume as number,
            color: item.close >= item.open ? '#4db6ac80' : '#e75f7780'
        }));
};