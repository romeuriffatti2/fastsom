import api from './api';

export async function getCategorias() {
  const { data } = await api.get('/admin/categorias');
  return data.data;
}

export async function createCategoria(payload) {
  const { data } = await api.post('/admin/categorias', payload);
  return data.data;
}

export async function updateCategoria(id, payload) {
  const { data } = await api.put(`/admin/categorias/${id}`, payload);
  return data.data;
}

export async function deleteCategoria(id) {
  await api.delete(`/admin/categorias/${id}`);
}
