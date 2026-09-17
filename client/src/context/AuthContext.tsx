import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api, { setAccessToken, API_BASE_URL } from '../api/client';
import { User } from '../types';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  simulationNotice: string | null;
  clearSimulationNotice: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // Silent Refresh on initial application load only if session exists
  useEffect(() => {
    // In React 18 Strict Mode, effects run twice in development.
    // Prevent duplicate concurrent refresh calls that trigger token rotation race conditions.
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      const hasSession = localStorage.getItem('proofpulse_has_session') === 'true';
      if (!hasSession) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        if (data.success && data.accessToken) {

          setAccessToken(data.accessToken);
          setUser(data.user);
        } else {
          localStorage.removeItem('proofpulse_has_session');
        }
      } catch (err) {
        // Silent failure if token expired or invalid
        localStorage.removeItem('proofpulse_has_session');
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('proofpulse_has_session', 'true');
      setAccessToken(data.accessToken);
      setUser(data.user);
    }
    return data;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    if (data.success) {
      localStorage.setItem('proofpulse_has_session', 'true');
      setAccessToken(data.accessToken);
      setUser(data.user);
      if (data.simulationLink) {
        setSimulationNotice(data.simulationLink);
      }
    }
    return data;
  };


  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore error during logout
    } finally {
      localStorage.removeItem('proofpulse_has_session');
      setAccessToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const clearSimulationNotice = () => setSimulationNotice(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        simulationNotice,
        clearSimulationNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
