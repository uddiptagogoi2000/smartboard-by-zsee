import { Box, Collapsible, Flex, Heading, List, Stack } from '@chakra-ui/react';
import {
  RiArrowDownSLine,
  RiArtboard2Line,
  RiBubbleChartLine,
  RiDashboardLine,
  RiDeviceLine,
  RiEyeOffLine,
  RiLayout2Line,
  RiLayoutGrid2Line,
} from '@remixicon/react';
import { Fragment, useState } from 'react';
import { useDashboardLayoutContext } from '../../layouts/DashboardLayout';
import { Button } from '../ui/button';
import { ColorModeButton } from '../ui/color-mode';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from '../ui/drawer';

// Base interface for common properties
interface BaseNavItem {
  icon: JSX.Element;
  name: string;
}

// Interface for link items
interface SidebarNavLinkItem extends BaseNavItem {
  type: 'link';
  link: string;
}

// Interface for collapsible items
interface SidebarNavCollapsibleItem extends BaseNavItem {
  type: 'collapsible';
  open: boolean;
  children: SidebarNavItem[];
}

// SidebarNavItem is a union of link and collapsible items
type SidebarNavItem = SidebarNavLinkItem | SidebarNavCollapsibleItem;

// Interface for a section in the sidebar
interface SidebarNavSection {
  section: string;
  items: SidebarNavItem[];
}

// Example data
const sidebarSections: SidebarNavSection[] = [
  {
    section: 'Interface',
    items: [
      {
        icon: <RiDashboardLine />,
        name: 'Dashboard',
        type: 'link',
        link: '/',
      },
      {
        icon: <RiBubbleChartLine />,
        name: 'Entities',
        type: 'collapsible',
        open: true,
        children: [
          {
            icon: <RiDeviceLine />,
            name: 'Devices',
            type: 'link',
            link: '/entities/devices',
          },
          {
            icon: <RiLayout2Line />,
            name: 'Assets',
            type: 'link',
            link: '/entities/assets',
          },
          {
            icon: <RiLayoutGrid2Line />,
            name: 'Entity views',
            type: 'link',
            link: '/entities/entity-views',
          },
        ],
      },
    ],
  },
];

type SideBarProps = {
  isVisible: boolean;
  onHide: () => void;
};

const Sidebar = ({ isVisible, onHide }: SideBarProps): JSX.Element => {
  const [sidebarObj, setSidebarObj] = useState(sidebarSections);
  const { isMobileSidebarOpen, onMobileSidebarOpen } =
    useDashboardLayoutContext();

  const handleOpenChange = (
    sectionIndex: number,
    itemIndex: number,
    open: boolean
  ) => {
    const newSidebarObj = sidebarObj.map((section, sIndex) => {
      if (sIndex === sectionIndex) {
        return {
          ...section,
          items: section.items.map((item, iIndex) => {
            if (item.type === 'collapsible' && iIndex === itemIndex) {
              return {
                ...item,
                open,
              };
            }
            return item;
          }),
        };
      }
      return section;
    });
    setSidebarObj(newSidebarObj);
  };

  let sidebarNavSections = sidebarObj.map((section, sectionIndex) => (
    <Box key={sectionIndex} py={2}>
      <Heading
        size={'sm'}
        letterSpacing={'2.4px'}
        fontWeight={'semibold'}
        fontSize={'xs'}
        textTransform={'uppercase'}
        py={2}
      >
        {section.section}
      </Heading>
      <List.Root listStyle={'none'} gap={'2'}>
        {section.items.map((item, itemIndex) => (
          <Fragment key={itemIndex}>
            {item.type === 'collapsible' ? (
              <Collapsible.Root
                open={item.open}
                onOpenChange={({ open }) =>
                  handleOpenChange(sectionIndex, itemIndex, open)
                }
              >
                <List.Item>
                  <Collapsible.Trigger asChild mb={1}>
                    <Button
                      width={'full'}
                      variant={'ghost'}
                      justifyContent={'start'}
                      rounded={'full'}
                      _open={{
                        bg: {
                          base: 'none',
                          _dark: 'none',
                        },
                      }}
                      _hover={{
                        bg: {
                          base: 'gray.100',
                          _dark: 'brand.darkborderline',
                        },
                      }}
                    >
                      {item.icon}
                      {item.name}
                      {item.type === 'collapsible' && (
                        <span
                          style={{
                            marginLeft: 'auto',
                            transform: item.open
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          <RiArrowDownSLine />
                        </span>
                      )}
                    </Button>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <List.Root listStyle={'none'} gap={'1'}>
                      {item.children.map((child, index) => (
                        <List.Item key={index}>
                          <Button
                            width={'full'}
                            variant={'ghost'}
                            justifyContent={'start'}
                            rounded={'full'}
                            pl={'8'}
                            _hover={{
                              bg: {
                                _dark: 'brand.darkborderline',
                              },
                            }}
                          >
                            {child.icon}
                            {child.name}
                          </Button>
                        </List.Item>
                      ))}
                    </List.Root>
                  </Collapsible.Content>
                </List.Item>
              </Collapsible.Root>
            ) : (
              <List.Item>
                <Button
                  width={'full'}
                  variant={'ghost'}
                  justifyContent={'start'}
                  colorPalette={'teal'}
                  rounded={'full'}
                  // bg={'teal.600'}
                  // color='white'
                  _hover={{
                    bg: {
                      _dark: 'brand.darkborderline',
                    },
                  }}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </List.Item>
            )}
          </Fragment>
        ))}
      </List.Root>
    </Box>
  ));

  let sidebarFooterSticky = (
    <Box
      position={'sticky'}
      bg={{ base: 'brand.white', _dark: 'brand.layerdark' }}
      bottom={0}
      left={0}
      right={0}
      width='full'
      opacity={0.9}
      py={4}
      borderTopWidth={1}
      borderTopStyle={'solid'}
      borderColor={{
        base: 'brand.layerlight',
        _dark: 'brand.darkborderline',
      }}
    >
      <Stack gap={2}>
        <ColorModeButton />
        <Button
          variant={'subtle'}
          onClick={onHide}
          display={{
            base: 'none',
            lg: 'flex',
          }}
        >
          <RiEyeOffLine />
          Hide Sidebar
        </Button>
        <Button
          variant={'subtle'}
          onClick={onMobileSidebarOpen}
          display={{
            lg: 'none',
          }}
        >
          <RiEyeOffLine />
          Hide Sidebar
        </Button>
      </Stack>
    </Box>
  );

  return (
    <>
      <Box
        as='aside'
        display={{
          base: 'none',
          lg: 'block',
        }}
        overflowY={'auto'}
        width={'290px'}
        px={4}
        borderRightWidth={1}
        borderStyle={'solid'}
        borderColor={{
          base: 'brand.layerlight',
          _dark: 'brand.darkborderline',
        }}
        bg={{ base: 'brand.white', _dark: 'brand.layerdark' }}
        transform={isVisible ? 'translateX(0)' : 'translateX(-100%)'}
        transition='transform 0.3s ease'
        position={'relative'}
      >
        {sidebarNavSections}
        {sidebarFooterSticky}
      </Box>

      <DrawerRoot
        placement={'start'}
        open={isMobileSidebarOpen}
        onOpenChange={onMobileSidebarOpen}
      >
        <DrawerBackdrop />
        {/* <DrawerTrigger asChild>
          <Button variant='outline' size='sm'>
            Open Drawer
          </Button>
        </DrawerTrigger> */}
        <DrawerContent
          display={{
            base: 'block',
            lg: 'none',
          }}
          bg={{ base: 'brand.white', _dark: 'brand.layerdark' }}
        >
          <DrawerHeader>
            <DrawerTitle>
              <Flex alignItems={'center'}>
                <RiArtboard2Line size={24} />
                <Heading ml={1} size={'xl'} fontWeight={'light'}>
                  SmartBoard
                </Heading>
              </Flex>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            {sidebarNavSections}
            {sidebarFooterSticky}
          </DrawerBody>
          {/* <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant='outline'>Cancel</Button>
            </DrawerActionTrigger>
            <Button>Save</Button>
          </DrawerFooter> */}
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default Sidebar;
