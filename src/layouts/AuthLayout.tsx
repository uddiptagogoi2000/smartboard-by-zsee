import { Box, Theme } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import circuitBoardPattern from '../assets/images/circuit-board.svg';

function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Theme appearance='light'>
      <Box
        height={'100vh'}
        overflow={'hidden'}
        position={'relative'}
        className='light'
        bg={{ base: 'brand.lightestgrey' }}
        display={'grid'}
        gridTemplateColumns={'1fr'}
        md={{ gridTemplateColumns: '2fr 1fr' }}
        lg={{ gridTemplateColumns: '1fr 1fr' }}
        xl={{ gridTemplateColumns: '1.3fr 1.7fr' }}
      >
        <Box
          display={'grid'}
          alignItems={'center'}
          justifyContent={'center'}
          overflow={'auto'}
        >
          <Box
            rounded={'lg'}
            px={{
              sm: 1,
              md: 2,
            }}
            md={{ w: 'md' }}
            maxW='md'
          >
            {children}
          </Box>
        </Box>
        <Box
          display={'none'}
          md={{ display: 'block' }}
          bgColor={'#f3f3f3'}
          backgroundImage={`url(${circuitBoardPattern})`}
        ></Box>
      </Box>
    </Theme>
  );
}

export default AuthLayout;
