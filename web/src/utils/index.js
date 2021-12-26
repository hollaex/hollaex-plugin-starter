import React from 'react';
import validator from 'validator';

export const required = value => (!value ? "Required" : undefined);

export const validateOtp = (message) => (
  value = ''
) => {
  let error = undefined;
  if (value.length !== 6 || !validator.isNumeric(value)) {
    error = message;
  }
  return error;
};

export const isBefore = (
  before = '',
  message = 'Invalid date'
) => {
  const beforeDate = before ? new Date(before) : new Date();
  const beforeValue = beforeDate.toString();
  return (value = '') => {
    const valueDate = new Date(value).toString();
    const valid = validator.isBefore(valueDate, beforeValue);
    return valid ? undefined : message;
  };
};

export const requiredBoolean = (message) => (value) =>
  value === undefined ? message || 'required' : undefined;

export const requiredWithCustomMessage = (message) => (value) =>
  !value ? message : undefined;