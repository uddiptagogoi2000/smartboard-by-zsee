import { Box, Flex } from '@chakra-ui/react';
import { RiEyeLine } from '@remixicon/react';
import { createContext, useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { Button } from '../components/ui/button';

export const useDashboardLayoutContext = () => {
  const context = useContext(DashboardLayoutContext);

  if (!context) {
    throw new Error(
      'DashboardLayoutContext must be used within a DashboardLayoutProvider'
    );
  }

  return context;
};

const DashboardLayoutContext = createContext({
  isSidebarVisible: true,
  onHideSidebar: () => {},
  onShowSidebar: () => {},
  isMobileSidebarOpen: false,
  onMobileSidebarOpen: () => {},
});

const DashboardLayout = (): JSX.Element => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleHideSidebar = () => setSidebarVisible(false);
  const handleShowSidebar = () => setSidebarVisible(true);

  return (
    <DashboardLayoutContext.Provider
      value={{
        isSidebarVisible,
        onHideSidebar: handleHideSidebar,
        onShowSidebar: handleShowSidebar,
        isMobileSidebarOpen,
        onMobileSidebarOpen: () => setIsMobileSidebarOpen(!isMobileSidebarOpen),
      }}
    >
      <Box
        height={'100vh'}
        overflow={'hidden'}
        bg={{ base: 'brand.lightestgrey', _dark: 'brand.darkestblue' }}
      >
        <Header isSidebarVisible={isSidebarVisible} />
        <Flex height={'calc(100vh - 78px)'} overflow={'hidden'}>
          <Sidebar isVisible={isSidebarVisible} onHide={handleHideSidebar} />
          <Box
            as='main'
            flex={1}
            bg={{ base: 'brand.lightestgrey', _dark: 'brand.darkestblue' }}
            ml={isSidebarVisible ? '0' : '-290px'} // Offset by sidebar width when hidden
            transition='margin-left 0.3s ease' // Smooth transition for the push effect
            // px={isSidebarVisible ? 8 : 4}
            overflow={'hidden'}
            height={'inherit'}
          >
            <Button
              onClick={handleShowSidebar}
              variant={'outline'}
              rounded={'full'}
              roundedStart={0}
              position={'fixed'}
              bottom={4}
              left={0}
              zIndex={999}
              transform={
                isSidebarVisible ? 'translateX(-100%)' : 'translateX(0)'
              }
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
    </DashboardLayoutContext.Provider>
  );
};

export default DashboardLayout;
