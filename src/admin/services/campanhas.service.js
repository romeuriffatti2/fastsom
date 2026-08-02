import api from './api';

export async function getCampanhas(params) {
  const { data } = await api.get('/admin/campanhas', { params });
  return data;
}

export async function getCampanhaById(id) {
  const { data } = await api.get(`/admin/campanhas/${id}`);
  return data.data;
}

export async function createCampanha(data) {
  const res = await api.post('/admin/campanhas', data);
  return res.data.data;
}

export async function updateCampanha(id, data) {
  const res = await api.put(`/admin/campanhas/${id}`, data);
  return res.data.data;
}

export async function deleteCampanha(id) {
  await api.delete(`/admin/campanhas/${id}`);
}

export async function dispararCampanha(id) {
  const { data } = await api.post(`/admin/campanhas/${id}/disparar`);
  return data;
}

export async function getCampanhaHistorico(id, params) {
  const { data } = await api.get(`/admin/campanhas/${id}/historico`, { params });
  return data;
}
