import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useErrorContext } from '../contexts/ErrorContext';

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
        }
    };

    const displayName = user?.displayName || user?.email || '';
    const userInitial = displayName ? displayName[0].toUpperCase() : 'U';

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#12141e]">
            <div className="navbar bg-[#0e101a] shadow-sm flex-shrink-0">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl text-white" href="/" data-discover="true">TradeMo</a>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="countdown font-mono text-lg text-white">
                        <span style={{"--value": hours} as React.CSSProperties} aria-live="polite" aria-label={`${hours} hours`}>{hours.toString().padStart(2, '0')}</span>:
                        <span style={{"--value": minutes} as React.CSSProperties} aria-live="polite" aria-label={`${minutes} minutes`}>{minutes.toString().padStart(2, '0')}</span>:
                        <span style={{"--value": seconds} as React.CSSProperties} aria-live="polite" aria-label={`${seconds} seconds`}>{seconds.toString().padStart(2, '0')}</span>
                    </span>
                    {error && (
                        <div role="alert" className="alert alert-error py-1 px-2 min-h-0 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                            <button className="btn btn-xs btn-ghost p-1" onClick={clearError}>×</button>
                        </div>
                    )}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold">{userInitial}</span>
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-[#21283b] rounded-box z-50 mt-3 w-52 p-2 shadow text-gray-200">
                            <li><span className="justify-between">{displayName}</span></li>
                            <li><a href="/" data-discover="true">Home</a></li>
                            <li><a href="/ranking" data-discover="true">Ranking</a></li>
                            <li className="divider my-1 before:bg-gray-700 after:bg-gray-700"></li>
                            <li><a className="text-red-400" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-hidden bg-[#1a1f2e] p-0">
                <div className="h-full w-full px-0">
                    {children}
                </div>
            </main>
        </div>
    );
} 