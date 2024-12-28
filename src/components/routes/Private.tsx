import { PropsWithChildren, useEffect, useState } from 'react';
import useBoundStore from '../../store';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';

const Private = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) navigate('/signin', { replace: true });
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <Box
        h={'100vh'}
        display={'grid'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Spinner color={'teal.500'} size={'lg'} />
      </Box>
    );
  }

  return children;
};

export default Private;
