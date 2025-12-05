import { login, signup, logout } from '../src/services/authService';
import * as SecureStore from 'expo-secure-store';
import * as securityUtils from '../src/utils/security';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock security utilities
jest.mock('../src/utils/security', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateSecureToken: jest.fn(),
}));

describe('AuthService', () => {
  const mockCredentials = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    token: 'secure-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should authenticate user with valid credentials', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify({
        email: mockCredentials.email,
        password: 'hashedPassword',
        id: '1',
      }));
      (securityUtils.verifyPassword as jest.Mock).mockResolvedValue(true);
      (securityUtils.generateSecureToken as jest.Mock).mockReturnValue('secure-token');

      const result = await login(mockCredentials);
      
      expect(result).toEqual({
        success: true,
        user: mockUser,
      });
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('user_test@example.com');
    });

    it('should fail with invalid credentials', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      
      const result = await login(mockCredentials);
      
      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
    });

    it('should handle password verification failure', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify({
        email: mockCredentials.email,
        password: 'hashedPassword',
        id: '1',
      }));
      (securityUtils.verifyPassword as jest.Mock).mockResolvedValue(false);
      
      const result = await login(mockCredentials);
      
      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
    });
  });

  describe('signup', () => {
    it('should create new user with valid data', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      (securityUtils.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (securityUtils.generateSecureToken as jest.Mock).mockReturnValue('secure-token');

      const result = await signup(mockCredentials);
      
      expect(result).toEqual({
        success: true,
        user: mockUser,
      });
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'user_test@example.com',
        expect.stringContaining('hashedPassword')
      );
    });

    it('should fail if user already exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify({}));
      
      const result = await signup(mockCredentials);
      
      expect(result).toEqual({
        success: false,
        error: 'User already exists',
      });
    });

    it('should handle storage errors', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
      (securityUtils.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      
      const result = await signup(mockCredentials);
      
      expect(result).toEqual({
        success: false,
        error: 'Failed to create account',
      });
    });
  });

  describe('logout', () => {
    it('should clear user session', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      const result = await logout();
      
      expect(result).toEqual({ success: true });
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('userSession');
    });

    it('should handle logout errors', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(new Error('Delete failed'));
      
      const result = await logout();
      
      expect(result).toEqual({ success: false, error: 'Logout failed' });
    });
  });
});