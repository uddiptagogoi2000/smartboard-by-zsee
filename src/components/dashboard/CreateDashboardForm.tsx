import { HStack, Input, Stack, Textarea } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createDashboardSchema } from '../../schemas';
import { capitalizeFirstLetter } from '../../utils';
import { Button } from '../ui/button';
import { Field } from '../ui/field';

type FormData = yup.InferType<typeof createDashboardSchema>;

type FormDialogProps = {
  onOpenChange?: (open: boolean) => void;
};

const CreateDashboardForm = ({ onOpenChange }: FormDialogProps) => {
  const {
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(createDashboardSchema, { abortEarly: false }),
  });

  return (
    <>
      <form>
        <Stack>
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
        </Stack>
      </form>
      <HStack gap={4} justifyContent={'flex-end'} mt={2}>
        <Button
          variant='ghost'
          colorScheme='gray'
          onClick={() => onOpenChange?.(false)}
        >
          Cancel
        </Button>
        <Button colorScheme='teal' onClick={() => console.log('Save clicked')}>
          Save
        </Button>
      </HStack>
    </>
  );
};

export default CreateDashboardForm;
