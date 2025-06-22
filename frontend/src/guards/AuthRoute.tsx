import { useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { THEME } from '../constants/colors';

interface AuthRouteProps {
    children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
            } else {
                setLoading(false);
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-screen ${THEME.background.primary.class}`}>
                <span className={`loading loading-spinner loading-lg ${THEME.text.buy.class}`}></span>
            </div>
        );
    }

    return <div>{children}</div>;
};

export default AuthRoute;