import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Table,
} from '@chakra-ui/react';
import { RiAddLine, RiResetRightLine, RiSearchLine } from '@remixicon/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonDialog } from '../components/common/CommonDialog';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '../components/ui/pagination';
import PageLayout from '../layouts/PageLayout';
import AddDeviceForm from '../components/dashboard/AddDeviceForm';
import { useGetDevicesByUser } from '../hooks/device/useDevice';

const DeviceListPage = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetDevicesByUser();
  console.log(data);

  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <PageLayout fixedHeight isLoading={isLoading}>
      <CommonDialog
        title='Add Device'
        open={open}
        onOpenChange={handleOpenChange}
      >
        <AddDeviceForm onOpenChange={handleOpenChange} />
      </CommonDialog>
      <Stack
        rounded={'sm'}
        height={'calc(0.95 * (100vh - 78px))'}
        bg={'transparent'}
      >
        <Flex justifyContent={'space-between'} p={4} alignItems={'center'}>
          <Heading>Devices</Heading>
          <HStack>
            <IconButton
              variant={'ghost'}
              rounded={'full'}
              onClick={() => handleOpenChange(true)}
            >
              <RiAddLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiResetRightLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton>
          </HStack>
        </Flex>
        <Table.ScrollArea height={'full'}>
          <Table.Root size='md' stickyHeader interactive striped>
            <Table.Header>
              <Table.Row bg='bg.subtle'>
                <Table.ColumnHeader>Unique Id</Table.ColumnHeader>
                <Table.ColumnHeader>Device Name</Table.ColumnHeader>
                <Table.ColumnHeader>Device Type</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.data.map((item) => (
                <Table.Row
                  key={item.deviceUniqueId}
                  onClick={() =>
                    navigate(
                      `/devices/${item.deviceUniqueId}?name=${item.deviceName}&deviceId=${item.deviceId}`
                    )
                  }
                >
                  <Table.Cell>{item.deviceUniqueId}</Table.Cell>
                  <Table.Cell>{item.deviceName}</Table.Cell>
                  <Table.Cell>{item.deviceType}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <PaginationRoot
          count={data?.data.length ?? 0}
          pageSize={5}
          page={1}
          py={2}
          ml={'auto'}
        >
          <HStack wrap='wrap'>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Stack>
    </PageLayout>
  );
};

export default DeviceListPage;
