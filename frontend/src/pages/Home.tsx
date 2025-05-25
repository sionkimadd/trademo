import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <main className="flex items-center justify-center h-screen bg-gray-100 p-4">
            <section className="max-w-md w-full bg-white rounded-lg p-6 text-center space-y-4">
                <h1 className="text-2xl font-bold">
                    Welcome{user && `, ${user.displayName || user.email}`}!
                </h1>
                <button onClick={handleLogout} className="btn btn-primary w-full">
                Logout
                </button>
            </section>
        </main>
    );
}