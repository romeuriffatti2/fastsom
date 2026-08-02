import api from './api';

export async function getTemplates() {
  const { data } = await api.get('/admin/templates');
  return data.data;
}

export async function getTemplateById(id) {
  const { data } = await api.get(`/admin/templates/${id}`);
  return data.data;
}

export async function createTemplate(data) {
  const res = await api.post('/admin/templates', data);
  return res.data.data;
}

export async function updateTemplate(id, data) {
  const res = await api.put(`/admin/templates/${id}`, data);
  return res.data.data;
}

export async function deleteTemplate(id) {
  await api.delete(`/admin/templates/${id}`);
}
