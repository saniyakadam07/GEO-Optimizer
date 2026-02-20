import React from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ShieldCheckIcon, 
  ArrowRightIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const SignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const loadToast = toast.loading('Authorizing secure access...');
    
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast.success(`Welcome, ${result.user.displayName.split(' ')[0]}!`, { id: loadToast });
        navigate('/dashboard'); // Adjusted to /dashboard to match your new App.jsx routing
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled.', { id: loadToast });
      } else {
        toast.error('Authentication failed. Check your Firebase console.', { id: loadToast });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <Toaster position="top-center" />
      
      {/* Background Decor - Global Aesthetic Blurs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[50%] bg-indigo-100/40 dark:bg-indigo-900/20 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[45%] bg-purple-100/30 dark:bg-purple-900/10 blur-[100px] rounded-full opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
        {/* Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-50 dark:border-slate-800 shadow-sm text-indigo-500 dark:text-indigo-400 text-[12px] font-semibold tracking-wide">
            <ShieldCheckIcon className="w-4 h-4" /> 
            Secure Authentication Protocol
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A3A] dark:text-white">
            GEO <span className="text-indigo-600 dark:text-indigo-400 font-serif italic font-normal">Engine</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
            Sign in to access advanced generative signals and structural diagnostics.
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.05)] dark:shadow-none p-10 space-y-8 text-center transition-all hover:shadow-xl dark:hover:border-slate-700">
          <div className="space-y-6">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <LockClosedIcon className="w-10 h-10 stroke-[1.5px]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold dark:text-white">Initialize Session</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                Connect your engineering identity
              </p>
            </div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            className="group w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5" 
            />
            Continue with Google
          </button>

          <p className="text-[10px] text-slate-300 dark:text-slate-600 font-mono tracking-widest uppercase">
            Encrypted End-to-End • SOC2 Compliant Logic
          </p>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all flex items-center gap-2 mx-auto w-fit"
          >
            Explore public metrics <ArrowRightIcon className="w-3 h-3 stroke-[3px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;