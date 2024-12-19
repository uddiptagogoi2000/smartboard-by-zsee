import { create, StateCreator } from 'zustand';

interface AuthSlice {
  token: string | null;
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
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
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
});

const useBoundStore = create<AuthSlice>()((...a) => ({
  ...createAuthSlice(...a),
}));

export default useBoundStore;
