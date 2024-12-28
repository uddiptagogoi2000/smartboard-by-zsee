import { useLocalStorage } from '@uidotdev/usehooks';
const AUTH_STORAGE_KEY = 'myApp.authState';

export const useLocalStorageManager = () => {
  const [authState, setAuthState] = useLocalStorage(AUTH_STORAGE_KEY, {
    isAuthenticated: true,
  });

  const updateAuthState = (isAuthenticated: boolean) => {
    setAuthState({ ...authState, isAuthenticated });
  };

  return { authState, updateAuthState };
};
