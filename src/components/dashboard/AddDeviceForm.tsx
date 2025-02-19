import {
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { capitalizeFirstLetter } from '../../utils';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { useRef } from 'react';
import { AddDeviceFormSchema } from '../../schemas';
import { DeviceService } from '../../services/deviceServices';
import { useQueryClient } from '@tanstack/react-query';

type FormData = yup.InferType<typeof AddDeviceFormSchema>;

type FormDialogProps = {
  onOpenChange?: (open: boolean) => void;
};

const AddDeviceForm = ({ onOpenChange }: FormDialogProps) => {
  const queryClient = useQueryClient(); 
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(AddDeviceFormSchema, { abortEarly: false }),
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (data: FormData) => {
    if(data.deviceName && data.deviceType) {
      try {
      const response = await  DeviceService.addDevice(data);
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['getAllDevices'] });
        onOpenChange?.(false);
      }
    } catch (error) {
      console.error(error);
    }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack ref={contentRef}>
        <Field
          label='Device Name'
          errorText={capitalizeFirstLetter(errors.deviceName?.message)}
          invalid={!!errors.deviceName}
          required
          colorPalette={'teal'}
        >
          <Input
            type='text'
            placeholder='Device Name'
            colorPalette={'white'}
            formNoValidate
            {...register('deviceName')}
          />
        </Field>
        <Field
          label='Device Type'
          invalid={!!errors.deviceType}
          helperText='The type of the device (e.g. Gateway, Controller etc.)'
          errorText={errors.deviceType?.message}
        >
          <Input
            type='text'
            placeholder='Device Type'
            colorPalette={'white'}
            formNoValidate
            {...register('deviceType')}
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

export default AddDeviceForm;
