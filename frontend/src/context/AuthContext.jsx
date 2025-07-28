import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // For demo purposes - set to true to bypass login
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoggedIn = async () => {
      if (token) {
        try {
          // You can add a call to verify the token with the backend here
          // For now, we'll just set the user from localStorage if available
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (error) {
          console.error('Authentication error:', error);
          logout(); // Logout if token is invalid
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Login function
  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Register function
  const register = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};