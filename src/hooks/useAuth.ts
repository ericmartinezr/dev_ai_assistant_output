import { useContext } from 'react';
import { AuthContext } from '../contexts/Auth';
import { User } from '../types';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, error, signIn, signUp, signOut } = context;

  const isAuthenticated = !!user;

  return {
    user: user as User | null,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
  };
};