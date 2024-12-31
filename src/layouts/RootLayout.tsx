import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocalStorageManager } from '../hooks/localStorage/useLocalStorageManager';
import useBoundStore from '../store';
// import { useGetUser } from '../hooks/auth/useGetUser';

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
  // const store = useBoundStore();
  // const { refetchUser } = useGetUser();

  // useEffect(() => {
  //   if (!store.isAuthenticated || !store.token || !store.user) {
  //     refetchUser();
  //   }
  // }, [store.isAuthenticated, store.token, store.user]);

  return <Outlet />;
};

export default RootLayout;
