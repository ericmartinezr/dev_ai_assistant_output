import { Middleware, Dispatch, AnyAction } from 'redux';
import { RootState } from '../store';
import { AuthService } from '../services/authService';

export const authMiddleware: Middleware<{}, RootState> = (api) => (next) => async (action) => {
  // Check if action requires authentication
  if (action.meta?.requiresAuth) {
    const state = api.getState();
    const token = state.auth.token || await AuthService.getStoredToken();
    
    if (!token) {
      // Dispatch redirect action
      next({
        type: 'auth/redirectToLogin',
        payload: 'Authentication required',
      });
      return;
    }

    // Validate token
    try {
      await AuthService.validateToken(token);
    } catch (error) {
      console.error('Token validation failed:', error);
      // Token invalid - logout
      next({
        type: 'auth/logout',
        payload: 'Session expired',
      });
      return;
    }
  }

  // Continue with the next middleware/action
  return next(action);
};

export default authMiddleware;