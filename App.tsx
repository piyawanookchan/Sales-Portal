
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

function App(): React.ReactNode {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = useCallback((): void => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback((): void => {
    setIsLoggedIn(false);
  }, []);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {isLoggedIn ? (
        <DashboardPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
