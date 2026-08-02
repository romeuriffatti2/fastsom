import api from './api';

export async function cadastrarNewsletter({ nome, email, telefone }) {
  const { data } = await api.post('/newsletter', {
    nome,
    email,
    telefone: telefone || null,
    lgpd_aceite: true,
  });
  return data;
}
