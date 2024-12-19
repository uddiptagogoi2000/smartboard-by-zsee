import * as yup from 'yup';

export const signupSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'Firstname must be at least 2 characters')
    .required('This field is required'),
  lastName: yup.string(),
  email: yup.string().email().required('This field is required'),
  password: yup
    .string()
    .required('This field is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one symbol'
    )
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('This field is required'),
});
