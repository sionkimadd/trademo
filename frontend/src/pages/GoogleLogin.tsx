import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { THEME } from '../constants/colors';

const GoogleLogo = () => (
  <svg 
    aria-label="Google logo" 
    width="16" 
    height="16" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512"
  >
    <g>
      <path d="m0 0H512V512H0" fill="#fff" />
      <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
      <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
      <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
      <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
    </g>
  </svg>
);

export default function GoogleLogin() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        { 
          displayName: user.displayName || 'unknown',
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString()
        },
        { merge: true }
      );

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed...');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className={`w-full h-screen flex items-center justify-center bg-gradient-to-br from-[${THEME.background.dark.hex}] to-[${THEME.background.overlay.hex}]`}>
      <div className="relative flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-8">Tra De Mo</h1>
        <p className="text-gray-400 mb-8">Virtual Stock Trading</p>
        
        {error && (
          <div 
            role="alert" 
            className="alert alert-error absolute -top-20 left-0 right-0 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={isAuthenticating} 
          className="btn w-60 h-12 bg-white hover:bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center space-x-3 text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            <span className="loading loading-spinner text-primary" />
          ) : (
            <>
              <GoogleLogo />
              <span>Google Login</span>
            </>
          )}
        </button>
        
        <p className="text-red-500 text-sm mt-8 text-center">
          Version 1.0
        </p>
      </div>
    </div>
  );
}
