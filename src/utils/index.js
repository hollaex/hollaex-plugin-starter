import validator from 'validator';

export const required = value => (!value ? "required" : undefined);

export const validateOtp = (message) => (
  value = ''
) => {
  let error = undefined;
  if (value.length !== 6 || !validator.isNumeric(value)) {
    error = message;
  }
  return error;
};