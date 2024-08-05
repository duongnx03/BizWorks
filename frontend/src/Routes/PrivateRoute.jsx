import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

const PrivateRoute = ({ element: Component, allowedRoles = [], ...rest }) => {
  const { isLoggedIn, userRole, isVerified } = useContext(AuthContext);

  // Hàm xử lý điều hướng dựa trên trạng thái của người dùng
  const handleRedirect = () => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    if (!isVerified) {
      return <Navigate to="/verification" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return <Navigate to="/error-404" />;
    }

    // Nếu tất cả các điều kiện đều đúng, trả về component
    return <Component {...rest} />;
  };

  return handleRedirect();
};

export default PrivateRoute;
