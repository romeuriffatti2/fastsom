import api from './api';

export async function getAlbunsAdmin(params) {
  const { data } = await api.get('/admin/galeria', { params });
  return data;
}

export async function getAlbumById(id) {
  const { data } = await api.get(`/admin/galeria/${id}`);
  return data.data;
}

export async function createAlbum(albumData) {
  const { data } = await api.post('/admin/galeria', albumData);
  return data.data;
}

export async function updateAlbum(id, albumData) {
  const { data } = await api.put(`/admin/galeria/${id}`, albumData);
  return data.data;
}

export async function deleteAlbum(id) {
  await api.delete(`/admin/galeria/${id}`);
}

export async function toggleAlbumPublicar(id, publicado) {
  const { data } = await api.patch(`/admin/galeria/${id}/publicar`, { publicado });
  return data.data;
}

export async function uploadAlbumFotos(id, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('fotos', file));
  const { data } = await api.post(`/admin/galeria/${id}/fotos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteAlbumFoto(id, fotoId) {
  await api.delete(`/admin/galeria/${id}/fotos/${fotoId}`);
}

export async function setAlbumFotoCapa(id, fotoId) {
  const { data } = await api.patch(`/admin/galeria/${id}/fotos/${fotoId}/capa`);
  return data;
}
