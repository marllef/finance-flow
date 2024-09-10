import { add, endOfDay, format, formatISO } from 'date-fns';

export const DateToISO = (value?: Date) =>
  value ? formatISO(value) : undefined;

export const FormatDate = (value: Date) => {
  return format(
    add(value, {
      hours: 3,
    }),
    'dd/MM/yyyy',
  );
};

export const NumberToPrecision = (value: number, precision = 2) =>
  Number(value?.toFixed(precision)) ?? 0;
