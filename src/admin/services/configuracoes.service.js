import api from './api';

export async function getConfiguracoesAdmin() {
  const { data } = await api.get('/admin/configuracoes');
  return data.data;
}

export async function updateConfiguracao(chave, valor) {
  const { data } = await api.put(`/admin/configuracoes/${chave}`, { valor });
  return data.data;
}

export async function uploadConfiguracaoMidia(chave, file) {
  const formData = new FormData();
  formData.append('arquivo', file);
  const { data } = await api.post(`/admin/configuracoes/upload/${chave}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}
