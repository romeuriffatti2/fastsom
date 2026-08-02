import api from './api';

export async function getContatos(params) {
  const { data } = await api.get('/admin/contatos', { params });
  return data;
}

export async function deleteContato(id) {
  await api.delete(`/admin/contatos/${id}`);
}

export async function toggleContatoStatus(id, ativo) {
  const { data } = await api.patch(`/admin/contatos/${id}/status`, { ativo });
  return data.data;
}

export async function addContatoTag(id, tag) {
  const { data } = await api.post(`/admin/contatos/${id}/tags`, { tag });
  return data.data;
}

export async function removeContatoTag(id, tag) {
  await api.delete(`/admin/contatos/${id}/tags/${tag}`);
}

export async function exportarContatosCSV() {
  const response = await api.get('/admin/contatos/exportar', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'contatos-fastsom.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
