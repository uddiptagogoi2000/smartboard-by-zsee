import { Box } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { ProgressBar, ProgressRoot } from '../components/ui/progress';

type PageLayoutProps = {
  isLoading?: boolean;
  fixedHeight?: boolean;
  fullWidth?: boolean;
};

const PageLayout = ({
  children,
  fixedHeight = false,
  isLoading = false,
  fullWidth = false,
}: PropsWithChildren & PageLayoutProps) => {
  return (
    <Box
      overflowX={fixedHeight ? 'hidden' : 'auto'}
      position={'relative'}
      height={fixedHeight ? '100%' : 'auto'}
      // minHeight={'100%'}
    >
      <ProgressRoot
        value={null}
        colorPalette={'teal'}
        accentColor={'teal.subtle'}
        variant={'subtle'}
        visibility={isLoading ? 'visible' : 'hidden'}
        position={'absolute'}
        top={0}
        left={0}
        right={0}
        zIndex={100}
      >
        <ProgressBar height={'0.5'} />
      </ProgressRoot>
      <Box p={fullWidth ? 0 : 4}>{children}</Box>
    </Box>
  );
};

export default PageLayout;
