import { useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export interface IAuthRouteProps {
    children: ReactNode;
}

const AuthRoute = ({ children }: IAuthRouteProps) => {
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
            <div className="flex items-center justify-center h-screen bg-[#141824]">
                <span className="loading loading-spinner loading-lg text-[#4db6ac]"></span>
            </div>
        );
    }

    return <div>{children}</div>;
};

export default AuthRoute;