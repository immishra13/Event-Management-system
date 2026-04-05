import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initMode = searchParams.get('mode') === 'signup' ? false : true;
  const [isLogin, setIsLogin] = useState(initMode);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(cred.user, { displayName: formData.name });
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          displayName: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString()
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-background"></div>
      <Navbar />
      <div className="container min-h-screen flex items-center justify-center pt-24" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
        
        <Motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-md p-8"
          style={{ width: '100%', maxWidth: '450px', padding: '40px' }}
        >
          <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {isLogin ? 'Welcome Back' : 'Join the Hub'}
            </h2>
            <p style={{ color: '#94a3b8' }}>
              {isLogin ? 'Enter your credentials to access your account' : 'Create an account to host or join amazing events'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <AnimatePresence>
              {!isLogin && (
                <Motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ position: 'relative' }}
                >
                  <User size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: '#94a3b8' }} />
                  <input 
                    name="name" type="text" placeholder="Full Name" required={!isLogin} 
                    value={formData.name} onChange={handleChange}
                    className="glass-input" style={{ paddingLeft: '48px' }}
                  />
                </Motion.div>
              )}
            </AnimatePresence>

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: '#94a3b8' }} />
              <input 
                name="email" type="email" placeholder="Email Address" required 
                value={formData.email} onChange={handleChange}
                className="glass-input" style={{ paddingLeft: '48px' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: '#94a3b8' }} />
              <input 
                name="password" type="password" placeholder="Password" required 
                value={formData.password} onChange={handleChange}
                className="glass-input" style={{ paddingLeft: '48px' }}
              />
            </div>

            {error && <div style={{ color: '#fb7185', fontSize: '0.875rem', padding: '12px', background: 'rgba(251, 113, 133, 0.1)', borderRadius: '8px', border: '1px solid rgba(251,113,133,0.2)' }}>{error}</div>}

            <button type="submit" className="btn btn-glow w-full mt-2" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#94a3b8' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#c4b5fd', fontWeight: '600', cursor: 'pointer' }}>
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </form>
        </Motion.div>

      </div>
    </>
  );
};

export default AuthPage;
