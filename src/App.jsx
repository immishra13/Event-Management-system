import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ExplorerPage from './pages/ExplorerPage';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import DetailsPage from './pages/DetailsPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient">
      <div className="spinner"></div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
        <Route path="/explore" element={<ExplorerPage />} />
        <Route path="/event/:id" element={<DetailsPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/create" element={user ? <CreateEvent /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
