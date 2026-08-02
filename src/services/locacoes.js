import api from './api';

export async function getLocacoes(params = {}) {
  try {
    const { data } = await api.get('/locacoes', { params });
    return data.data;
  } catch (err) {
    console.warn('Erro ao carregar locações da API:', err.message);
    return [];
  }
}
