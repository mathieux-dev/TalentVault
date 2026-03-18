export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isPhoneValid(value: string) {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}