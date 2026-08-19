import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Navbar } from './components/Navbar';
import { Auth } from './pages/Auth';
import { TouristDashboard } from './pages/TouristDashboard';
import { GuideDashboard } from './pages/GuideDashboard';

export const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('raahi_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('raahi_token') || '';
  });

  const [socket, setSocket] = useState(null);

  // Initialize Socket Connection
  useEffect(() => {
    const socketUrl = window.location.origin.includes('3000')
      ? 'http://localhost:5000'
      : window.location.origin;

    const newSocket = io(socketUrl, {
      autoConnect: true,
      reconnection: true
    });

    setSocket(newSocket);

    if (user && newSocket) {
      newSocket.emit('user:register', {
        userId: user._id,
        role: user.role,
        name: user.name
      });
    }

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('raahi_user', JSON.stringify(userData));
    localStorage.setItem('raahi_token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('raahi_user');
    localStorage.removeItem('raahi_token');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={user.role === 'guide' ? '/guide' : '/tourist'} replace />
                ) : (
                  <Auth onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            <Route
              path="/auth"
              element={<Auth onLoginSuccess={handleLoginSuccess} />}
            />

            <Route
              path="/tourist"
              element={
                user ? (
                  <TouristDashboard user={user} socket={socket} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            <Route
              path="/guide"
              element={
                user ? (
                  <GuideDashboard user={user} socket={socket} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
          <p>© 2026 RAAHI On-Demand Tourist-Guide Platform. Built for trusted travel & scam prevention.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
