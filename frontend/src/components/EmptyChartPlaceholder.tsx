import { THEME } from '../constants/colors';

export default function EmptyChartPlaceholder() {
    return (
        <div className={`${THEME.background.secondary.class} rounded-xl p-3 mb-3 h-[500px] flex items-center justify-center`}>
            <div className="text-center text-gray-600">
                <div className="text-4xl font-bold text-gray-500">
                    Hello...
                </div>
            </div>
        </div>
    );
} 