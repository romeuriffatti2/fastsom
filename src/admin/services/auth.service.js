import api from './api';

export async function login({ email, senha }) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function alterarSenha({ senha_atual, nova_senha, confirmar_senha }) {
  const { data } = await api.put('/auth/senha', { senha_atual, nova_senha, confirmar_senha });
  return data;
}
