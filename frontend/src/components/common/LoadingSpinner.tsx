import { THEME } from '../../constants/colors';

interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg';
    color?: string;
    fullScreen?: boolean;
    message?: string;
}

export default function LoadingSpinner({ 
    size = 'md', 
    color = THEME.text.buy.class,
    fullScreen = false,
    message 
}: LoadingSpinnerProps) {
    const sizeClass = `loading-${size}`;
    
    const spinner = (
        <div className="flex flex-col items-center">
            <span className={`loading loading-spinner ${sizeClass} ${color}`} />
            {message && <p className="text-sm text-gray-300 mt-2">{message}</p>}
        </div>
    );
    
    if (fullScreen) {
        return (
            <div className={`flex items-center justify-center h-full ${THEME.background.primary.class}`}>
                {spinner}
            </div>
        );
    }
    
    return spinner;
} 