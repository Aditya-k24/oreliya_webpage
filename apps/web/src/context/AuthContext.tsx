import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { User, LoginRequest, SignUpRequest, AuthResponse } from '../types';
import { apiClient, ApiClient } from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignUpRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' });
        return;
      }

      const response = await apiClient.get<AuthResponse>('/auth/me');
      if (response.data.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.data.user });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid token' });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      );

      if (response.data.success) {
        const { user, tokens } = response.data.data;
        ApiClient.setAuthTokens(tokens);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.data.message || 'Login failed',
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    }
  }, []);

  const signup = useCallback(async (userData: SignUpRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await apiClient.post<AuthResponse>(
        '/auth/signup',
        userData
      );

      if (response.data.success) {
        const { user, tokens } = response.data.data;
        ApiClient.setAuthTokens(tokens);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.data.message || 'Signup failed',
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    }
  }, []);

  const logout = useCallback(() => {
    ApiClient.clearAuthTokens();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = useMemo(
    () => ({
      ...state,
      login,
      signup,
      logout,
      clearError,
      checkAuth,
    }),
    [state, login, signup, logout, clearError, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
