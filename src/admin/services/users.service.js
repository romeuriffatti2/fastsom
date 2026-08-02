import api from './api';

export async function getUsers(params) {
  const { data } = await api.get('/admin/users', { params });
  return data;
}

export async function createUser(userData) {
  const { data } = await api.post('/admin/users', userData);
  return data.data;
}

export async function updateUser(id, userData) {
  const { data } = await api.put(`/admin/users/${id}`, userData);
  return data.data;
}

export async function toggleUserStatus(id, ativo) {
  const { data } = await api.patch(`/admin/users/${id}/status`, { ativo });
  return data.data;
}

export async function resetUserSenha(id, nova_senha) {
  const { data } = await api.put(`/admin/users/${id}/senha`, { nova_senha });
  return data;
}
