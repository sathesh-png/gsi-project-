import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signInAnonymously, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';
import { Bot, ShieldCheck, LogIn, Loader2, AlertCircle, HelpCircle, ArrowRight, Mail, Lock, UserPlus } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
}

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export default function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<{ code: string; message: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setErrorInfo(null);
      setSuccessMessage(null);
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      console.error("Google sign in failure:", e);
      setErrorInfo({ 
        code: e?.code || 'unknown', 
        message: e?.message || 'Failed to authenticate via Google.' 
      });
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setErrorInfo(null);
      setSuccessMessage(null);
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Email auth failure:", err);
      const errCode = err?.code || 'unknown';
      let errMsg = err?.message || String(err);
      
      if (errCode === 'auth/invalid-credential') {
        errMsg = 'Incorrect email address or password. Please verify your credentials and try again.';
      } else if (errCode === 'auth/email-already-in-use') {
        errMsg = 'An account already exists under this email address.';
      } else if (errCode === 'auth/weak-password') {
        errMsg = 'Password must be at least 6 characters.';
      } else if (errCode === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      } else if (errCode === 'auth/operation-not-allowed') {
        errMsg = 'Email/Password sign-in method is not enabled in your Firebase project. Please enable it in Firebase Console > Authentication > Sign-in method.';
      }
      
      setErrorInfo({ code: errCode, message: errMsg });
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      setErrorInfo({ code: 'missing-email', message: 'Please enter your email address above to reset your password.' });
      setSuccessMessage(null);
      return;
    }
    try {
      setLoading(true);
      setErrorInfo(null);
      setSuccessMessage(null);
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent! Please check your inbox.');
      setLoading(false);
    } catch (err: any) {
      console.error("Password reset failure:", err);
      let errMsg = err?.message || String(err);
      if (err?.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format. Please enter a valid email to reset.';
      } else if (err?.code === 'auth/user-not-found') {
        errMsg = 'No registered user was found with this email address.';
      }
      setErrorInfo({ code: err?.code || 'reset-failed', message: errMsg });
      setLoading(false);
    }
  };

  const loginAnonymously = async () => {
    try {
      setLoading(true);
      setErrorInfo(null);
      await signInAnonymously(auth);
    } catch (e: any) {
      console.error("Anonymous guest sign in failure:", e);
      setErrorInfo({
        code: 'anonymous-disabled',
        message: 'Anonymous login failed. Ensure Anonymous Provider is enabled in your Firebase Auth dashboard.'
      });
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout failure:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-800 font-sans" id="firebase-loading-fallback">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center space-y-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 text-indigo-605 animate-spin mx-auto text-indigo-600" />
          <h2 className="font-extrabold tracking-tight text-slate-800 text-lg">Syncing Firebase Database</h2>
          <p className="text-xs text-slate-500 leading-normal">
            Connecting to GSI Workspace secure servers. Please wait...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 font-sans" id="auth-unauthenticated-portal">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80 text-center space-y-6 max-w-md w-full relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-24 -top-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="mx-auto w-12 h-12 bg-indigo-650/15 rounded-2xl flex items-center justify-center text-indigo-650 shadow-xs">
            <Bot className="w-6 h-6 text-indigo-600" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
              GSI Workspace Console
            </h1>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block font-mono">
              MALAYSIAN E-COMMERCE MULTI-AGENT BOARD
            </p>
          </div>

          {/* Conditional Troubleshooting / Error Card */}
          {errorInfo && (
            <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3.5 text-left space-y-2.5" id="auth-trouble-card">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-rose-800">Authentication Alert</h3>
                  <p className="text-[10px] text-rose-700 font-medium font-mono leading-tight mt-0.5">
                    Code: {errorInfo.code}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed bg-white/80 rounded-lg p-2.5 border border-rose-100/50">
                {errorInfo.message}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left space-y-2.5" id="auth-success-card">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5 text-[10px] font-bold">✓</div>
                <div>
                  <h3 className="text-xs font-bold text-emerald-800">Operation Success</h3>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed bg-white/80 rounded-lg p-2.5 border border-emerald-100/50">
                {successMessage}
              </p>
            </div>
          )}

          {/* Core Sign In Actions */}
          <div className="space-y-4 pt-1 text-left">
            {/* Traditional Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3" id="email-password-login-form">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block" htmlFor="auth-email">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gsiwork.com"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-550 transition placeholder:text-slate-405 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block" htmlFor="auth-password">
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-550 transition placeholder:text-slate-405 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer border border-transparent"
                id="btn-email-submit"
              >
                {isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4 text-white" /> Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-white" /> Sign In
                  </>
                )}
              </button>

              <div className="text-center pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorInfo(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer underline"
                  id="btn-toggle-auth-mode"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Need an account? Sign Up"}
                </button>

                {!isSignUp && (
                  <button
                    type="button"
                    onClick={resetPassword}
                    className="text-[10px] text-slate-500 hover:text-slate-700 font-bold underline cursor-pointer"
                    id="btn-forgot-password"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            </form>

            <div className="relative flex py-1.5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              onClick={loginWithGoogle}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-slate-200"
              id="btn-google-login"
            >
              <LogIn className="w-4 h-4 text-slate-600" /> Sign In with Google
            </button>
          </div>

          <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold font-mono uppercase tracking-tight pt-1 border-t border-slate-100 mt-2">
            <span>Build v2.5.0</span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Preview Iframe Fallback Enabled
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
