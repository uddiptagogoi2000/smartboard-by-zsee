import {
  createListCollection,
  HStack,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createDashboardSchema } from '../../schemas';
import { capitalizeFirstLetter } from '../../utils';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../../services/dashboardService';
import {
  SelectContent,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectItem,
} from '../ui/select';
import { useMemo, useRef } from 'react';

type FormData = yup.InferType<typeof createDashboardSchema>;

type FormDialogProps = {
  onOpenChange?: (open: boolean) => void;
};

const CreateDashboardForm = ({ onOpenChange }: FormDialogProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: yupResolver(createDashboardSchema, { abortEarly: false }),
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['devices'],
    queryFn: DashboardService.getDevicesByUser,
  });

  const devices = useMemo(() => {
    return createListCollection({
      items:
        data?.data?.data.map((item) => ({
          label: item.deviceName,
          value: item.deviceUniqueId,
        })) || [],
    });
  }, [data]);

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit} noValidate>
      <Stack ref={contentRef}>
        <Field
          label='Title'
          errorText={capitalizeFirstLetter(errors.title?.message)}
          invalid={!!errors.title}
          required
          colorPalette={'teal'}
        >
          <Input
            type='text'
            placeholder='Title'
            colorPalette={'white'}
            formNoValidate
            {...register('title')}
          />
        </Field>
        <Field
          label='Description'
          invalid={!!errors.description}
          helperText='A short description of dashboard'
          errorText={errors.description?.message}
        >
          <Textarea colorPalette={'teal'} {...register('description')} />
        </Field>
        <Field
          label='Device'
          invalid={!!errors.deviceId}
          errorText={errors.deviceId?.message}
        >
          <Controller
            control={control}
            name='deviceId'
            render={({ field }) => {
              return (
                <SelectRoot
                  collection={devices}
                  value={field.value}
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

export default CreateDashboardForm;
