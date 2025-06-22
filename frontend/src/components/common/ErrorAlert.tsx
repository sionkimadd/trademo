import { THEME } from '../../constants/colors';

interface ErrorAlertProps {
    message: string;
    onClose?: () => void;
    fullScreen?: boolean;
    compact?: boolean;
}

export default function ErrorAlert({ 
    message, 
    onClose,
    fullScreen = false,
    compact = false
}: ErrorAlertProps) {
    const alertContent = (
        <div className={`alert alert-error ${THEME.action.sell.class} bg-opacity-20 border-none ${compact ? 'py-1 px-2 min-h-0 text-sm' : ''}`}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`stroke-current shrink-0 ${compact ? 'h-3 w-3' : 'h-6 w-6'}`}
                fill="none" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
            </svg>
            <span>{message}</span>
            {onClose && (
                <button 
                    className={`btn ${compact ? 'btn-xs' : 'btn-sm'} btn-ghost p-1`}
                    onClick={onClose}
                    aria-label="Close error"
                >
                    x
                </button>
            )}
        </div>
    );
    
    if (fullScreen) {
        return (
            <div className={`h-full flex items-center justify-center ${THEME.background.dark.class}`}>
                <div className="max-w-lg">
                    {alertContent}
                </div>
            </div>
        );
    }
    
    return alertContent;
} 