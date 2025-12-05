import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginCredentials, SignupData, User } from './types';
import { encryptData, decryptData } from '../utils/security';
import { validateEmail, validatePassword } from '../utils/validation';

const AUTH_STORAGE_KEY = 'auth_data';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    // Validate input
    if (!validateEmail(credentials.email)) {
      return rejectWithValue('Invalid email format');
    }
    
    if (!validatePassword(credentials.password)) {
      return rejectWithValue('Password must be at least 8 characters');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an API call
    const user: User = {
      id: '1',
      email: credentials.email,
      name: 'Test User',
    };
    
    // Encrypt and store auth data
    const encryptedData = encryptData(JSON.stringify(user));
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, encryptedData);
    
    return user;
  } catch (error) {
    return rejectWithValue('Login failed');
  }
});

export const signup = createAsyncThunk<
  User,
  SignupData,
  { rejectValue: string }
>('auth/signup', async (data, { rejectWithValue }) => {
  try {
    // Validate input
    if (!validateEmail(data.email)) {
      return rejectWithValue('Invalid email format');
    }
    
    if (!validatePassword(data.password)) {
      return rejectWithValue('Password must be at least 8 characters');
    }
    
    if (data.name.trim().length < 2) {
      return rejectWithValue('Name must be at least 2 characters');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an API call
    const user: User = {
      id: '1',
      email: data.email,
      name: data.name,
    };
    
    // Encrypt and store auth data
    const encryptedData = encryptData(JSON.stringify(user));
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, encryptedData);
    
    return user;
  } catch (error) {
    return rejectWithValue('Signup failed');
  }
});

export const logout = createAsyncThunk<void, void>('auth/logout', async () => {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
});

export const checkAuthStatus = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>('auth/checkStatus', async (_, { rejectWithValue }) => {
  try {
    const encryptedData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!encryptedData) return null;
    
    const decryptedData = decryptData(encryptedData);
    const user: User = JSON.parse(decryptedData);
    
    return user;
  } catch (error) {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return rejectWithValue('Authentication check failed');
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login reducers
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Login failed';
    });
    
    // Signup reducers
    builder.addCase(signup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Signup failed';
    });
    
    // Logout reducers
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
    
    // Check auth status reducers
    builder.addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      } else {
        state.isAuthenticated = false;
        state.user = null;
      }
    });
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
