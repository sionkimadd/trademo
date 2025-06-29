import { useEffect } from 'react';
import { CandlestickChartProps, TimeFrame } from '../types/chart';
import { useChartData, TIMEFRAME_CONFIG } from '../hooks/useChartData';
import { useChart } from '../hooks/useChart';
import TimeframeButton from './TimeframeButton';
import { THEME } from '../constants/colors';

const TIMEFRAME_OPTIONS: Array<{
  tf: TimeFrame;
  label: string;
}> = [
  { tf: '1m', label: '1Min' },
  { tf: '1h', label: '1Hour' },
  { tf: '1d', label: 'Daily' },
  { tf: '1wk', label: 'Weekly' },
  { tf: '1mo', label: 'Monthly' }
];

export default function CandlestickChart({
  symbol,
  initialData = [],
}: CandlestickChartProps) {
  const {
    data,
    timeFrame,
    loading,
    error,
    lastUpdateTimes,
    fetchData,
    handleTimeFrameChange,
    formatDateTime,
    scheduleNextUpdate,
    refreshIntervalRef
  } = useChartData(symbol, initialData);

  const { chartContainerRef } = useChart(data, timeFrame);

  useEffect(() => {
    fetchData();
    
    scheduleNextUpdate();
    
    return () => {
      if (refreshIntervalRef.current) {
        clearTimeout(refreshIntervalRef.current);
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [symbol, timeFrame]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
        <div className="flex flex-wrap gap-1">
          {TIMEFRAME_OPTIONS.map(({ tf, label }) => (
            <TimeframeButton
              key={tf}
              tf={tf}
              currentTf={timeFrame}
              label={label}
              updateTime={formatDateTime(lastUpdateTimes[tf])}
              cycleInfo={TIMEFRAME_CONFIG[tf].updateCycle}
              onClick={handleTimeFrameChange}
            />
          ))}
        </div>
        
        {lastUpdateTimes[timeFrame] && (
          <div className="flex flex-col items-end text-xs">
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">Last Update:</span>
              <span className="text-gray-300">{formatDateTime(lastUpdateTimes[timeFrame])}</span>
            </div>
            <div className="text-gray-500 mt-0.5">
              <span>Update Cycle: {TIMEFRAME_CONFIG[timeFrame].updateCycle}</span>
            </div>
          </div>
        )}
      </div>
      
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center ${THEME.background.secondary.class} bg-opacity-50 z-10`}>
          <div className="flex flex-col items-center">
            <span className={`loading loading-spinner loading-md ${THEME.text.buy.class}`}></span>
            <p className="text-sm text-gray-300 mt-2">Loading chart data...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className={`absolute inset-0 flex items-center justify-center ${THEME.background.secondary.class} bg-opacity-50 z-10`}>
          <div className={`${THEME.action.sell.class} bg-opacity-20 rounded-lg p-3 max-w-xs text-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-8 w-8 ${THEME.text.sell.class} mb-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white text-sm font-medium">{error}</p>
            <p className="text-gray-200 text-xs mt-1">Unable to connect to API server or an error occurred while fetching data.</p>
          </div>
        </div>
      )}
      
      <div 
        ref={chartContainerRef} 
        className={`w-full flex-1 relative ${(loading || error) ? 'opacity-40' : ''}`}
        style={{ minHeight: '250px' }}
      />
    </div>
  );
} 