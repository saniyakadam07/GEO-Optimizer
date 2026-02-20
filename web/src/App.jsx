import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import Synthesis from "./pages/Synthesis";
import Analysis from "./pages/Analysis";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GeneralChatbot from './components/GeneralChatbot';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFF] dark:bg-slate-950 transition-colors duration-300">
      <Navbar user={user} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route
            path="/signin"
            element={!user ? <SignIn /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/signin" />}
          />
          <Route path="/synthesis" element={<Synthesis />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
      <GeneralChatbot user={user} />
    </div>
  );
}

export default App;