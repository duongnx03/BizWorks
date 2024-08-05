import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole'));
  const [isVerified, setIsVerified] = useState(() => sessionStorage.getItem('isVerified') === 'true');

  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('userRole', userRole);
    sessionStorage.setItem('isVerified', isVerified);
  }, [isLoggedIn, userRole, isVerified]);

  const login = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setIsVerified(false);
  };

  const verifyUser = () => {
    setIsVerified(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, isVerified, login, logout, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
