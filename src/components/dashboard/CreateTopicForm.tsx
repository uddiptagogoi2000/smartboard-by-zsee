import {
  Alert,
  createListCollection,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useGetDevicesByUser } from '../../hooks/dashboard/useDashboard';
import { createTopicSchema } from '../../schemas';
import { capitalizeFirstLetter } from '../../utils';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../ui/select';

type FormData = yup.InferType<typeof createTopicSchema>;

type FormDialogProps = {
  onOpenChange?: (open: boolean) => void;
  onAdd: (topicInfo: {
    deviceId: string;
    topicForControl: string;
    topicForPublish: string;
  }) => void;
};

const CreateTopicForm = ({ onOpenChange, onAdd }: FormDialogProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: yupResolver(createTopicSchema, { abortEarly: false }),
  });
  const contentRef = useRef<HTMLDivElement>(null);

  const { data } = useGetDevicesByUser();
  console.log('errors', errors);

  const devices = useMemo(() => {
    return createListCollection({
      items:
        data?.data?.map((item) => ({
          label: item.deviceName,
          value: item.deviceUniqueId,
        })) || [],
    });
  }, [data]);

  const onSubmit = handleSubmit((data) => {
    console.log('here', data);
    onAdd({
      deviceId: data.deviceId?.[0] || '',
      topicForControl: data.topicForControl || '',
      topicForPublish: data.topicForPublish || '',
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      {Object.keys(errors).includes('') ? (
        <Alert.Root status='error' mb={5}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Invalid Fields</Alert.Title>
            <Alert.Description>
              {errors['' as keyof typeof errors]?.message}
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : (
        <Alert.Root mb={5}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>At Least One Topic Required</Alert.Title>
            <Alert.Description>
              You need to enter at least one topic—either a 'Control Topic' or a
              'Publish Topic'. If you're unsure, enter the one that best fits
              your use case!
            </Alert.Description>
          </Alert.Content>
          {/* <CloseButton pos='relative' top='-2' insetEnd='-2' /> */}
        </Alert.Root>
      )}
      <Stack ref={contentRef}>
        <Field
          label='Device'
          invalid={!!errors.deviceId}
          errorText={errors.deviceId?.message}
          required
        >
          <Controller
            control={control}
            name='deviceId'
            render={({ field }) => {
              return (
                <SelectRoot
                  collection={devices}
                  value={field.value as string[]}
                  onValueChange={({ value }) => field.onChange(value)}
                  onInteractOutside={() => field.onBlur()}
                  colorPalette={'teal'}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder='Select device' />
                  </SelectTrigger>
                  <SelectContent portalRef={contentRef} maxHeight={'200px'}>
                    {devices.items.map((device) => (
                      <SelectItem item={device} key={device.value}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              );
            }}
          />
        </Field>
        <Field
          label='Control Topic'
          errorText={capitalizeFirstLetter(errors.topicForControl?.message)}
          invalid={!!errors.topicForControl}
          colorPalette={'teal'}
        >
          <Input
            type='text'
            placeholder='Control Topic'
            colorPalette={'white'}
            formNoValidate
            {...register('topicForControl')}
          />
        </Field>
        <Field
          label='Publish Topic'
          invalid={!!errors.topicForPublish}
          errorText={errors.topicForPublish?.message}
          colorPalette={'teal'}
        >
          <Input
            type='text'
            placeholder='Publish Topic'
            colorPalette={'white'}
            formNoValidate
            {...register('topicForPublish')}
          />
        </Field>
      </Stack>
      <HStack gap={4} justifyContent={'flex-end'} mt={5}>
        <Button
          variant='ghost'
          colorScheme='gray'
          onClick={() => onOpenChange?.(false)}
        >
          Cancel
        </Button>
        <Button colorScheme='teal' type='submit'>
          Save
        </Button>
      </HStack>
    </form>
  );
};

export default CreateTopicForm;
