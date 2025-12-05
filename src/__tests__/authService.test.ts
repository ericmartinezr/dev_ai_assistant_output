import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { authService } from '../services/authService';
import { store } from '../store';
import { setUser, clearUser } from '../store/slices/authSlice';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native-keychain');

// Mock store dispatch
const mockDispatch = jest.fn();
jest.mock('../store', () => ({
  ...jest.requireActual('../store'),
  store: {
    ...jest.requireActual('../store').store,
    dispatch: mockDispatch,
  },
}));

// Mock AsyncStorage methods
(AsyncStorage.removeItem as jest.Mock) = jest.fn().mockResolvedValue(undefined);

const mockCredentials = {
  username: 'test@example.com',
  password: 'password123',
};

const mockUser = {
  uid: 'user123',
  email: 'test@example.com',
  displayName: 'Test User',
};

const mockIdToken = 'mock-id-token';

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Mock Firebase auth methods
      const mockSignIn = jest.fn().mockResolvedValue({
        user: mockUser,
        _tokenResponse: { idToken: mockIdToken },
      });
      
      // Properly mock authService methods
      const authServiceMock = authService as any;
      authServiceMock.auth = {
        signInWithEmailAndPassword: mockSignIn,
      };

      (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(mockCredentials.username, mockCredentials.password);
      
      expect(mockSignIn).toHaveBeenCalledWith(mockCredentials.username, mockCredentials.password);
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        mockCredentials.username,
        mockIdToken,
        { service: 'alarm_notifier_token' }
      );
      expect(mockDispatch).toHaveBeenCalledWith(setUser({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
      }));
      expect(result).toEqual({
        success: true,
        user: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
        },
      });
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      const mockSignIn = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      // Properly mock authService methods
      const authServiceMock = authService as any;
      authServiceMock.auth = {
        signInWithEmailAndPassword: mockSignIn,
      };

      const result = await authService.login(mockCredentials.username, mockCredentials.password);
      
      expect(mockSignIn).toHaveBeenCalledWith(mockCredentials.username, mockCredentials.password);
      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });
    });
  });

  describe('signup', () => {
    it('should signup user successfully', async () => {
      const mockSendEmailVerification = jest.fn().mockResolvedValue(undefined);
      
      const mockCreateUser = jest.fn().mockResolvedValue({
        user: {
          ...mockUser,
          sendEmailVerification: mockSendEmailVerification,
        },
      });
      
      // Properly mock authService methods
      const authServiceMock = authService as any;
      authServiceMock.auth = {
        createUserWithEmailAndPassword: mockCreateUser,
      };

      const result = await authService.signup(mockCredentials.username, mockCredentials.password);
      
      expect(mockCreateUser).toHaveBeenCalledWith(mockCredentials.username, mockCredentials.password);
      expect(mockSendEmailVerification).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should handle signup failure', async () => {
      const errorMessage = 'Email already in use';
      const mockCreateUser = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      // Properly mock authService methods
      const authServiceMock = authService as any;
      authServiceMock.auth = {
        createUserWithEmailAndPassword: mockCreateUser,
      };

      const result = await authService.signup(mockCredentials.username, mockCredentials.password);
      
      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const mockSignOut = jest.fn().mockResolvedValue(undefined);
      
      // Properly mock authService methods
      const authServiceMock = authService as any;
      authServiceMock.auth = {
        signOut: mockSignOut,
      };
      
      (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(true);

      await authService.logout();
      
      expect(mockSignOut).toHaveBeenCalled();
      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({ service: 'alarm_notifier_token' });
      expect(mockDispatch).toHaveBeenCalledWith(clearUser());
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_preferences');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      // Properly mock authService auth property
      const authServiceMock = authService as any;
      authServiceMock.auth = {
        currentUser: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          getIdToken: jest.fn().mockResolvedValue(mockIdToken),
        },
      };

      const user = await authService.getCurrentUser();
      
      expect(user).toEqual({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
      });
    });

    it('should return null when no user is authenticated', async () => {
      // Properly mock authService auth property
      const authServiceMock = authService as any;
      authServiceMock.auth = {
        currentUser: null,
      };

      const user = await authService.getCurrentUser();
      
      expect(user).toBeNull();
    });
  });
});