import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocalStorageManager } from '../hooks/localStorage/useLocalStorageManager';
import useBoundStore from '../store';

function useSyncLocalStorageWithStore() {
  const { authState } = useLocalStorageManager();
  const { setIsAuthenticated } = useBoundStore();

  useEffect(() => {
    setIsAuthenticated(authState.isAuthenticated);
  }, [authState.isAuthenticated]);

  console.log({ authState });
}

const RootLayout = () => {
  useSyncLocalStorageWithStore();

  return <Outlet />;
};

export default RootLayout;
