import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useErrorContext } from '../contexts/ErrorContext';
import { ErrorAlert } from './common';
import { THEME } from '../constants/colors';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const { error, clearError } = useErrorContext();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const displayName = user?.displayName || user?.email || '';
    const userInitial = displayName ? displayName[0].toUpperCase() : 'U';

    const formatTimeValue = (value: number): string => {
        return value.toString().padStart(2, '0');
    };

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${THEME.background.overlay.class}`}>
            <nav className={`navbar ${THEME.background.darker.class} shadow-sm flex-shrink-0`}>
                <div className="flex-1">
                    <a 
                        className="btn btn-ghost text-xl text-white" 
                        href="/" 
                        data-discover="true"
                    >
                        Tra De Mo
                    </a>
                </div>
                
                <div className="flex gap-2 items-center">
                    <div className="font-mono text-lg text-white">
                        <span>{formatTimeValue(currentTime.getHours())}</span>:
                        <span>{formatTimeValue(currentTime.getMinutes())}</span>:
                        <span>{formatTimeValue(currentTime.getSeconds())}</span>
                    </div>
                    
                    {error && (
                        <ErrorAlert 
                            message={error} 
                            onClose={clearError}
                            compact
                        />
                    )}
                    
                    <div className="dropdown dropdown-end">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="btn btn-ghost btn-circle avatar"
                            aria-label="User menu"
                        >
                            <div className="w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-orange-500">{userInitial}</span>
                            </div>
                        </div>
                        
                        <ul 
                            tabIndex={0} 
                            className={`menu menu-sm dropdown-content ${THEME.background.dropdown.class} rounded-box z-50 mt-3 w-52 p-2 shadow text-gray-200`}
                        >
                            <li><span className="justify-between">{displayName}</span></li>
                            <li><a href="/" data-discover="true">Trading</a></li>
                            <li><a href="/ranking" data-discover="true">Ranking</a></li>
                            <li><a href="/news" data-discover="true">News</a></li>
                            <li className="divider my-1 before:bg-gray-700 after:bg-gray-700" />
                            <li>
                                <a 
                                    className="text-red-400 hover:text-red-300" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className={`flex-1 overflow-y-auto ${THEME.background.overlay.class}`}>
                {children}
            </main>
        </div>
    );
} 