import { api } from '../../../shared/lib/api';

export async function registerAccount(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function loginAccount(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function fetchCurrentUser(token) {
  const response = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data.user;
}

export async function updateProfile(token, payload) {
  const response = await api.patch('/profile', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data.user;
}

export async function submitDriverVerification(token, payload) {
  const response = await api.post('/driver-verification', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data.profile;
}

export async function getMyDriverVerification(token) {
  const response = await api.get('/driver-verification/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data.profile;
}

export function getAuthError(error) {
  return error.response?.data?.message || 'Unable to complete your request. Please try again.';
}
