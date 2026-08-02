import api from './api';

export async function getConfiguracoes() {
  try {
    const { data } = await api.get('/configuracoes');
    return data.data;
  } catch (err) {
    console.warn('Usando configurações padrão (API indisponível):', err.message);
    return null;
  }
}
