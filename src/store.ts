import { create, StateCreator } from 'zustand';

/**
 *
 * if refresh-token api call starts, renewTokenStatus will be 'loading'
 * if refresh-token api call is successful, renewTokenStatus will be 'success' - then make it 'idle'
 * if refresh-token api call fails, renewTokenStatus will be 'error' - session expired
 *
 */

interface AuthSlice {
  token: string | null;
  renewTokenStatus: 'idle' | 'loading' | 'success' | 'error';
  isAuthenticated: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  setUser: (user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => void;

  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: true,
  renewTokenStatus: 'idle',
  token: null,
  user: null,
  setUser: (user) =>
    set((state) => ({
      user: {
        ...state.user,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
      },
    })),

  setIsAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
  },

  setToken: (token) => {
    set({ token });
  },
});

const useBoundStore = create<AuthSlice>()((...a) => ({
  ...createAuthSlice(...a),
}));

export default useBoundStore;
