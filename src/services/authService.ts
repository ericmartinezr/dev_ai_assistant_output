import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { User } from '../types';

const USERS_COLLECTION = 'users';

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;
      
      // Create user profile in Firestore
      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName,
        createdAt: new Date().toISOString(),
      };
      
      await firestore()
        .collection(USERS_COLLECTION)
        .doc(user.uid)
        .set(userData);
      
      // Store session token securely
      await this.storeUserSession(user.uid, await user.getIdToken());
      
      return userData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const { user } = userCredential;
      
      // Get user data from Firestore
      const userDoc = await firestore()
        .collection(USERS_COLLECTION)
        .doc(user.uid)
        .get();
      
      if (!userDoc.exists) {
        throw new Error('User data not found');
      }
      
      const userData = userDoc.data() as User;
      
      // Store session token securely
      await this.storeUserSession(user.uid, await user.getIdToken());
      
      return userData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
      await Keychain.resetGenericPassword();
      await AsyncStorage.clear();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = auth().currentUser;
      if (!user) return null;
      
      const userDoc = await firestore()
        .collection(USERS_COLLECTION)
        .doc(user.uid)
        .get();
      
      if (!userDoc.exists) return null;
      
      return userDoc.data() as User;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Store user session securely
  private async storeUserSession(uid: string, token: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(uid, token, {
        service: 'com.app.user.session',
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle authentication errors
  private handleError(error: any): Error {
    console.error('Auth service error:', error);
    
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return new Error('Email is already in use');
        case 'auth/invalid-email':
          return new Error('Invalid email address');
        case 'auth/weak-password':
          return new Error('Password is too weak');
        case 'auth/user-not-found':
          return new Error('User not found');
        case 'auth/wrong-password':
          return new Error('Incorrect password');
        default:
          return new Error('Authentication failed');
      }
    }
    
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const authService = new AuthService();