import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';

export default function GoogleAuthPage() {
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginGoogle = async () => {
    setAuthing(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        { displayName: user.displayName || 'unknown' },
        { merge: true }
      );

      navigate('/');
    } catch (err) {
      setError('Denied');
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center fixed inset-0">
      <div className="relative flex flex-col w-60">
        <div className="absolute -top-13 left-0 right-0">
          {error && (
            <div 
              role="alert" 
              className="w-full h-10 bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 shrink-0 stroke-current" 
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
              <span>{error}</span>
            </div>
          )}
        </div>
        <div>
          <button 
            onClick={loginGoogle} 
            disabled={authing} 
            className="btn w-full h-10 bg-white text-black rounded-lg flex items-center justify-center space-x-2 text-sm font-semibold"
          >
            {authing ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              <>
                <svg 
                  aria-label="Google logo" 
                  width="16" 
                  height="16" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                    <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                    <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                    <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                  </g>
                </svg>
                <span>Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
