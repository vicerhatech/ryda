import AppError from '../../../shared/utils/AppError.js';

const PUBLIC_REGISTRATION_ROLES = ['RIDER', 'DRIVER'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireText(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${fieldName} is required.`, 400);
  }
}

export function validateRegistrationInput(input = {}) {
  const { fullName, email, phone, password, role = 'RIDER' } = input;

  requireText(fullName, 'Full name');
  requireText(email, 'Email');
  requireText(phone, 'Phone');
  requireText(password, 'Password');

  if (!EMAIL_PATTERN.test(email.trim())) {
    throw new AppError('A valid email address is required.', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 400);
  }

  if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
    throw new AppError('Registration role must be RIDER or DRIVER.', 400);
  }

  return {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password,
    role
  };
}

export function validateLoginInput(input = {}) {
  const { email, password } = input;

  requireText(email, 'Email');
  requireText(password, 'Password');

  if (!EMAIL_PATTERN.test(email.trim())) {
    throw new AppError('A valid email address is required.', 400);
  }

  return { email: email.trim().toLowerCase(), password };
}
