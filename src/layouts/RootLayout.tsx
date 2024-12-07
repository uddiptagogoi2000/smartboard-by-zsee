import { Box, Flex } from '@chakra-ui/react';
import { RiEyeLine } from '@remixicon/react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { Button } from '../components/ui/button';

const RootLayout = (): JSX.Element => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const handleHideSidebar = () => setSidebarVisible(false);
  const handleShowSidebar = () => setSidebarVisible(true);

  return (
    <Box
      height={'100vh'}
      overflow={'hidden'}
      bg={{ base: 'brand.lightestgrey', _dark: 'brand.darkestblue' }}
    >
      <Header isSidebarVisible={isSidebarVisible} />
      <Flex height={'calc(100vh - 78px)'}>
        <Sidebar isVisible={isSidebarVisible} onHide={handleHideSidebar} />
        <Box
          as='main'
          flex={1}
          bg={{ base: 'brand.lightestgrey', _dark: 'brand.darkestblue' }}
          ml={isSidebarVisible ? '0' : '-290px'} // Offset by sidebar width when hidden
          transition='margin-left 0.3s ease' // Smooth transition for the push effect
          px={isSidebarVisible ? 8 : 4}
        >
          <Link to='/signup'>Signup</Link>
          <Button
            onClick={handleShowSidebar}
            variant={'outline'}
            rounded={'full'}
            roundedStart={0}
            position={'fixed'}
            bottom={4}
            left={0}
            zIndex={999}
            transform={isSidebarVisible ? 'translateX(-100%)' : 'translateX(0)'}
            transition={isSidebarVisible ? 'none' : 'transform 0.3s ease'}
            transitionDelay={isSidebarVisible ? '0s' : '0.3s'} // Add delay when hiding
            bgGradient='to-r'
            gradientFrom={'teal.400'}
            gradientTo={'teal.600'}
          >
            <RiEyeLine color='white' />
          </Button>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};

export default RootLayout;
