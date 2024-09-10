export const FormatAccountNumber = ({ value }) =>
  (value || 0).toString().padStart(5, '0');

export const FormatAccountDigit = ({ value }) =>
  (value || 0).toString().padStart(2, '0');

