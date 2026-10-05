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

export function getAuthError(error) {
  return error.response?.data?.message || 'Unable to complete your request. Please try again.';
}
