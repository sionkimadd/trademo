import { memo, useState } from 'react';
import { TimeframeButtonProps } from '../types/chart';
import { THEME } from '../constants/colors';

const TimeframeButton = ({ 
  tf, 
  currentTf, 
  label, 
  updateTime, 
  cycleInfo, 
  onClick 
}: TimeframeButtonProps) => {
  const isActive = tf === currentTf;
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative">
      <button
        className={`btn btn-xs h-6 px-2 text-xs border-none rounded-md transition-colors ${
          isActive
            ? THEME.action.buy.class + ' text-white'
            : `bg-[${THEME.chart.grid}] text-gray-300 hover:bg-[${THEME.chart.border}]`
        }`}
        onClick={() => onClick(tf)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {label}
      </button>
      
      {showTooltip && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-[9999]">
          <div className={`bg-[${THEME.background.tooltip.hex}] text-white text-xs rounded-md p-2 shadow-lg border border-gray-600 whitespace-nowrap relative`}>
            <div className="font-bold mb-1">{label} Chart</div>
            <div className="text-gray-300">
              <div>Update Cycle: {cycleInfo}</div>
              {updateTime && (
                <div>Last Update: {updateTime}</div>
              )}
            </div>
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2">
              <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-600"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(TimeframeButton); 