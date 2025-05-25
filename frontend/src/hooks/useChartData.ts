import { useState, useCallback, useRef, useReducer } from 'react';
import { TimeFrame, ApiCounterState, ApiCounterAction, CandlestickDataWithVolume } from '../types/chart';
import { API_PATHS, API_BASE_URL, ChartDataResponse, ApiErrorResponse, SUPPORTED_TIMEFRAMES } from '../types/api';

export const TIMEFRAME_CONFIG: Record<TimeFrame, {
  period: string;
  updateCycle: string;
  resetTime: number;
  apiCallLimit: number;
}> = {
  '1m': {
    period: '7d',
    updateCycle: 'Every minute',
    resetTime: 60 * 1000,
    apiCallLimit: 1
  },
  '1h': {
    period: '700d',
    updateCycle: 'Every hour',
    resetTime: 60 * 60 * 1000,
    apiCallLimit: 1
  },
  '1d': {
    period: 'max',
    updateCycle: 'Daily at 9 AM',
    resetTime: 24 * 60 * 60 * 1000,
    apiCallLimit: 1
  },
  '1wk': {
    period: 'max',
    updateCycle: 'Monday at 9 AM',
    resetTime: 7 * 24 * 60 * 60 * 1000,
    apiCallLimit: 1
  },
  '1mo': {
    period: 'max',
    updateCycle: 'First Monday at 9 AM',
    resetTime: 30 * 24 * 60 * 60 * 1000,
    apiCallLimit: 1
  }
};

const apiCounterReducer = (state: ApiCounterState, action: ApiCounterAction): ApiCounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        counts: {
          ...state.counts,
          [action.timeframe]: state.counts[action.timeframe] + 1
        }
      };
    case 'RESET_COUNTER':
      return {
        ...state,
        counts: {
          ...state.counts,
          [action.timeframe]: 0
        },
        lastResetTimes: {
          ...state.lastResetTimes,
          [action.timeframe]: action.timestamp
        }
      };
    default:
      return state;
  }
};

const initializeTimeFrameRecord = <T>(defaultValue: T): Record<TimeFrame, T> => {
  const result: Partial<Record<TimeFrame, T>> = {};
  SUPPORTED_TIMEFRAMES.forEach(tf => {
    result[tf] = defaultValue;
  });
  return result as Record<TimeFrame, T>;
};

function calculateNextUpdateTime(timeFrame: TimeFrame, now: Date): { millisecondsToNext: number; intervalTime: number } {
  switch (timeFrame) {
    case '1m': {
      const secondsToNextMinute = 60 - now.getSeconds();
      return {
        millisecondsToNext: secondsToNextMinute * 1000 - now.getMilliseconds(),
        intervalTime: 60 * 1000
      };
    }
    case '1h': {
      const minutesToNextHour = 60 - now.getMinutes();
      const secondsToNextHour = minutesToNextHour * 60 - now.getSeconds();
      return {
        millisecondsToNext: secondsToNextHour * 1000 - now.getMilliseconds(),
        intervalTime: 60 * 60 * 1000
      };
    }
    case '1d':
    case '1wk':
    case '1mo': {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      const today9am = new Date(now);
      today9am.setHours(9, 0, 0, 0);
      
      const target = now < today9am ? today9am : tomorrow;
      return {
        millisecondsToNext: target.getTime() - now.getTime(),
        intervalTime: 24 * 60 * 60 * 1000
      };
    }
  }
}

export interface ChartDataHookResult {
  data: CandlestickDataWithVolume[];
  timeFrame: TimeFrame;
  loading: boolean;
  error: string | null;
  timeframeData: Record<TimeFrame, CandlestickDataWithVolume[]>;
  lastUpdateTimes: Record<TimeFrame, string>;
  fetchData: () => Promise<CandlestickDataWithVolume[]>;
  handleTimeFrameChange: (newTimeFrame: TimeFrame) => void;
  formatDateTime: (dateString: string) => string;
  scheduleNextUpdate: () => void;
  refreshIntervalRef: React.MutableRefObject<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval> | null>;
}

export function useChartData(symbol: string, initialData: CandlestickDataWithVolume[] = []): ChartDataHookResult {
  const [data, setData] = useState<CandlestickDataWithVolume[]>(initialData);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1m');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [timeframeData, setTimeframeData] = useState<Record<TimeFrame, CandlestickDataWithVolume[]>>(
    initializeTimeFrameRecord<CandlestickDataWithVolume[]>([])
  );
  
  const [lastUpdateTimes, setLastUpdateTimes] = useState<Record<TimeFrame, string>>(
    initializeTimeFrameRecord<string>('')
  );

  const [apiCounterState, dispatchApiCounter] = useReducer(apiCounterReducer, {
    counts: initializeTimeFrameRecord<number>(0),
    lastResetTimes: initializeTimeFrameRecord<Date>(new Date())
  });
  
  const refreshIntervalRef = useRef<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval> | null>(null);
  const isDataFetchingRef = useRef<boolean>(false);
  const lastApiCallRef = useRef<{time: number, id: string}>({time: 0, id: ''});

  const hasData = useCallback((tf: TimeFrame): boolean => {
    return timeframeData[tf].length > 0;
  }, [timeframeData]);

  const checkApiCallLimit = useCallback((): boolean => {
    if (timeFrame === '1m') {
      return true;
    }
    
    const now = new Date();
    const lastResetTime = apiCounterState.lastResetTimes[timeFrame];
    
    if (now.getTime() - lastResetTime.getTime() >= TIMEFRAME_CONFIG[timeFrame].resetTime) {
      dispatchApiCounter({ type: 'RESET_COUNTER', timeframe: timeFrame, timestamp: now });
      return true;
    }
    
    return apiCounterState.counts[timeFrame] < TIMEFRAME_CONFIG[timeFrame].apiCallLimit;
  }, [timeFrame, apiCounterState]);

  const incrementApiCallCount = useCallback(() => {
    dispatchApiCounter({ type: 'INCREMENT', timeframe: timeFrame });
  }, [timeFrame]);

  const fetchData = useCallback(async (): Promise<CandlestickDataWithVolume[]> => {
    if (!symbol || isDataFetchingRef.current) return [];
    
    const now = Date.now();
    const callId = `${symbol}-${timeFrame}`;
    
    if (now - lastApiCallRef.current.time < 200 && lastApiCallRef.current.id === callId) {
      return [];
    }

    if (!checkApiCallLimit()) return [];

    isDataFetchingRef.current = true;
    lastApiCallRef.current = { time: now, id: callId };
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_PATHS.CHART}/${symbol}?timeframe=${timeFrame}&period=${TIMEFRAME_CONFIG[timeFrame].period}`
      );
      
      if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        throw new Error(errorData.detail || `Failed to fetch chart data: ${response.statusText}`);
      }
      
      const chartData = await response.json() as ChartDataResponse;
      
      if (!chartData?.data?.length) {
        throw new Error('Chart data is empty');
      }
      
      const newData = chartData.data;
      setData(newData);
      setTimeframeData(prev => ({ ...prev, [timeFrame]: newData }));
      setLastUpdateTimes(prev => ({ ...prev, [timeFrame]: new Date().toISOString() }));
      
      if (timeFrame !== '1m') {
        incrementApiCallCount();
      }
      
      return newData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load chart data');
      setData([]);
      return [];
    } finally {
      setLoading(false);
      isDataFetchingRef.current = false;
    }
  }, [symbol, timeFrame, checkApiCallLimit, incrementApiCallCount]);

  const scheduleNextUpdate = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearTimeout(refreshIntervalRef.current);
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (!symbol) return;

    const { millisecondsToNext, intervalTime } = calculateNextUpdateTime(timeFrame, new Date());

    refreshIntervalRef.current = setTimeout(() => {
      fetchData();
      
      refreshIntervalRef.current = setInterval(() => {
        fetchData();
      }, intervalTime);
    }, millisecondsToNext);
  }, [symbol, timeFrame, fetchData]);

  const handleTimeFrameChange = useCallback((newTimeFrame: TimeFrame) => {
    if (newTimeFrame !== timeFrame) {
      setTimeFrame(newTimeFrame);
      
      if (hasData(newTimeFrame)) {
        setData(timeframeData[newTimeFrame]);
      } else {
        const now = new Date();
        dispatchApiCounter({ 
          type: 'RESET_COUNTER', 
          timeframe: newTimeFrame, 
          timestamp: now 
        });
      }
    }
  }, [timeFrame, timeframeData, hasData, dispatchApiCounter]);

  const formatDateTime = useCallback((dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }, []);

  return {
    data,
    timeFrame,
    loading,
    error,
    timeframeData,
    lastUpdateTimes,
    fetchData,
    handleTimeFrameChange,
    formatDateTime,
    scheduleNextUpdate,
    refreshIntervalRef
  };
} 