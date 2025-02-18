import { useLocalStorage } from '@uidotdev/usehooks';
const AUTH_STORAGE_KEY = 'myApp.authState';

export const useLocalStorageManager = () => {
  const [authState, setAuthState] = useLocalStorage(AUTH_STORAGE_KEY, {
    isAuthenticated: true,
    at: '',
  });

  const updateAuthState = ({
    isAuthenticated,
    at,
  }: {
    isAuthenticated: boolean;
    at: string;
  }) => {
    setAuthState({ ...authState, isAuthenticated, at });
  };

  return { authState, updateAuthState };
};
