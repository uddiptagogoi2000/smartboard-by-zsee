import { Box, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react';
import { RiAppsFill, RiArtboard2Line, RiFolder2Fill } from '@remixicon/react';
import { RiMore2Line } from 'react-icons/ri';
import { Avatar } from '../ui/avatar';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '../ui/breadcrumb';

type HeaderProps = {
  isSidebarVisible: boolean;
};

const Header = ({ isSidebarVisible }: HeaderProps): JSX.Element => {
  return (
    <Box
      as='header'
      height='78px'
      bg={{ base: 'brand.white', _dark: 'brand.layerdark' }}
    >
      <Flex height='100%' alignItems={'center'}>
        <Flex
          height='inherit'
          alignItems='center'
          fontSize={'xl'}
          justifyContent={'start'}
          borderBottomWidth={1}
          borderRightWidth={isSidebarVisible ? 1 : 0}
          borderStyle={'solid'}
          borderColor={{
            base: 'brand.layerlight',
            _dark: 'brand.darkborderline',
          }}
          px={4}
          width={'290px'}
        >
          <RiArtboard2Line size={24} />
          <Heading ml={1} size={'xl'} fontWeight={'light'}>
            SmartBoard
          </Heading>
        </Flex>
        <Box
          flex={1}
          height='inherit'
          borderBottomWidth={1}
          borderBottomStyle={'solid'}
          borderColor={{
            base: 'brand.layerlight',
            _dark: 'brand.darkborderline',
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems='center'
            height='inherit'
            px={8}
          >
            <Box>
              <BreadcrumbRoot variant='plain'>
                <BreadcrumbLink href='#' fontSize={'larger'}>
                  <RiFolder2Fill /> Resources
                </BreadcrumbLink>
                <BreadcrumbLink href='#' fontSize={'larger'}>
                  <RiAppsFill /> Widgets Library
                </BreadcrumbLink>
                <BreadcrumbCurrentLink fontSize={'larger'}>
                  Widgets
                </BreadcrumbCurrentLink>
              </BreadcrumbRoot>
            </Box>
            <Box>
              <Flex>
                <Avatar />
                <Stack gap={2} ml={2}>
                  <Stack gap='1'>
                    <Text textStyle='sm' fontWeight='semibold'>
                      Manjit Barman
                    </Text>
                    <Text textStyle='sm' color='fg.muted'>
                      Tenant administator
                    </Text>
                  </Stack>
                </Stack>
                <IconButton variant='ghost' ml={4}>
                  <RiMore2Line />
                </IconButton>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;