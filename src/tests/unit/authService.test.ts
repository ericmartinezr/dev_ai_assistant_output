import { auth, firebaseAuth } from '../../services/auth';
import * as Keychain from 'react-native-keychain';

// Mock the Keychain module
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue({ service: 'authToken' }),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue(false)
}));

// Mock the Firebase auth module
jest.mock('../../services/auth', () => {
  const mockFirebaseAuth = {
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null
  };
  
  return {
    auth: {
      signUp: jest.requireActual('../../services/auth').auth.signUp,
      signIn: jest.requireActual('../../services/auth').auth.signIn,
      signOut: jest.requireActual('../../services/auth').auth.signOut,
      getCurrentUser: jest.requireActual('../../services/auth').auth.getCurrentUser
    },
    firebaseAuth: mockFirebaseAuth
  };
});

describe('AuthService', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockToken = 'mock-jwt-token';
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the currentUser to null before each test
    firebaseAuth.currentUser = null;
  });

  describe('signUp', () => {
    it('should create a user and store credentials', async () => {
      (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { getIdToken: jest.fn().mockResolvedValue(mockToken) }
      });
      
      const result = await auth.signUp(mockEmail, mockPassword);
      
      expect(firebaseAuth.createUserWithEmailAndPassword)
        .toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        mockEmail, 
        mockToken
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle signup errors', async () => {
      const errorMessage = 'Signup failed';
      (firebaseAuth.createUserWithEmailAndPassword as jest.Mock)
        .mockRejectedValue(new Error(errorMessage));
      
      const result = await auth.signUp(mockEmail, mockPassword);
      
      expect(result).toEqual({ 
        success: false, 
        error: errorMessage 
      });
    });
  });

  describe('signIn', () => {
    it('should sign in user and store credentials', async () => {
      (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { getIdToken: jest.fn().mockResolvedValue(mockToken) }
      });
      
      const result = await auth.signIn(mockEmail, mockPassword);
      
      expect(firebaseAuth.signInWithEmailAndPassword)
        .toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        mockEmail, 
        mockToken
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle signin errors', async () => {
      const errorMessage = 'Signin failed';
      (firebaseAuth.signInWithEmailAndPassword as jest.Mock)
        .mockRejectedValue(new Error(errorMessage));
      
      const result = await auth.signIn(mockEmail, mockPassword);
      
      expect(result).toEqual({ 
        success: false, 
        error: errorMessage 
      });
    });
  });

  describe('signOut', () => {
    it('should clear stored credentials', async () => {
      (firebaseAuth.signOut as jest.Mock).mockResolvedValue(undefined);
      
      const result = await auth.signOut();
      
      expect(firebaseAuth.signOut).toHaveBeenCalled();
      expect(Keychain.resetGenericPassword).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should handle signout errors', async () => {
      const errorMessage = 'Signout failed';
      (firebaseAuth.signOut as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      const result = await auth.signOut();
      
      expect(result).toEqual({ 
        success: false, 
        error: errorMessage 
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const mockUser = { uid: '123', email: mockEmail };
      // Set currentUser as a property, not a function
      firebaseAuth.currentUser = mockUser;
      
      const result = await auth.getCurrentUser();
      
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is authenticated', async () => {
      // currentUser is already null from beforeEach, but being explicit here
      firebaseAuth.currentUser = null;
      
      const result = await auth.getCurrentUser();
      
      expect(result).toBeNull();
    });
  });
});