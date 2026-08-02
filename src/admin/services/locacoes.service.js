import api from './api';

export async function getLocacoesAdmin(params) {
  const { data } = await api.get('/admin/locacoes', { params });
  return data;
}

export async function getLocacaoById(id) {
  const { data } = await api.get(`/admin/locacoes/${id}`);
  return data.data;
}

export async function createLocacao(formData) {
  const { data } = await api.post('/admin/locacoes', formData);
  return data.data;
}

export async function updateLocacao(id, formData) {
  const { data } = await api.put(`/admin/locacoes/${id}`, formData);
  return data.data;
}

export async function deleteLocacao(id) {
  await api.delete(`/admin/locacoes/${id}`);
}

export async function toggleLocacaoStatus(id, ativo) {
  const { data } = await api.patch(`/admin/locacoes/${id}/status`, { ativo });
  return data.data;
}

export async function toggleLocacaoDestaque(id, destaque) {
  const { data } = await api.patch(`/admin/locacoes/${id}/destaque`, { destaque });
  return data.data;
}

export async function uploadLocacaoImagens(id, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('imagens', file));
  const { data } = await api.post(`/admin/locacoes/${id}/imagens`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteLocacaoImagem(id, imagemId) {
  await api.delete(`/admin/locacoes/${id}/imagens/${imagemId}`);
}

export async function setLocacaoImagemPrincipal(id, imagemId) {
  const { data } = await api.patch(`/admin/locacoes/${id}/imagens/${imagemId}/principal`);
  return data;
}

export async function getCategorias() {
  const { data } = await api.get('/admin/categorias');
  return data.data;
}
