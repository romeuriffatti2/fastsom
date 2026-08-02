import api from './api';

export async function getLogs(params) {
  const { data } = await api.get('/admin/logs', { params });
  return data;
}

export async function getLogById(id) {
  const { data } = await api.get(`/admin/logs/${id}`);
  return data.data;
}
