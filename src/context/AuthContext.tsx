import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { auth } from '../services/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Retrieve token from secure Keychain storage
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const token = credentials.password;
          const userData = await auth.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially corrupted auth data
        await AsyncStorage.removeItem('authToken');
        await Keychain.resetGenericPassword();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await auth.signIn(email, password);
      await Keychain.setGenericPassword('user', token);
      setUser(userData);
    } catch (error) {
      // Clear auth data on sign in failure
      await AsyncStorage.removeItem('authToken');
      await Keychain.resetGenericPassword();
      throw error; // Re-throw to let caller handle
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await auth.signUp(email, password);
      await Keychain.setGenericPassword('user', token);
      setUser(userData);
    } catch (error) {
      // Clear auth data on sign up failure
      await AsyncStorage.removeItem('authToken');
      await Keychain.resetGenericPassword();
      throw error; // Re-throw to let caller handle
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out API error:', error);
    } finally {
      // Always clear local auth data
      await AsyncStorage.removeItem('authToken');
      await Keychain.resetGenericPassword();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (user) {
      try {
        const userData = await auth.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('User refresh error:', error);
        // If refreshing user fails, sign out to prevent inconsistent state
        await signOut();
      }
    }
  };

  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};