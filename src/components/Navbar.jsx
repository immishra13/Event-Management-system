import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, LogOut, Compass, PlusCircle, LayoutDashboard } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="container glass-panel py-4 px-6 flex justify-between items-center bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-2xl mx-auto" style={{ maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl brand-font" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cloud size={24} color="white" />
          </div>
          Cloud Event Hub
        </Link>
        
        <div className="flex items-center gap-6" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/explore" className="text-gray-300 hover:text-white transition flex items-center gap-2" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} /> Explore
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition flex items-center gap-2" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/create" className="text-gray-300 hover:text-white transition flex items-center gap-2" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={18} /> Create Event
              </Link>
              <div className="w-px h-6 bg-white/10" style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
              <button onClick={handleLogout} className="text-rose-400 hover:text-rose-300 transition flex items-center gap-2" style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="w-px h-6 bg-white/10" style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
              <Link to="/auth" className="text-gray-300 hover:text-white transition font-medium" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
              <Link to="/auth?mode=signup" className="btn btn-glow">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
