import api from './api';

export async function getAlbuns() {
  try {
    const { data } = await api.get('/galeria');
    return data.data;
  } catch (err) {
    console.warn('Erro ao carregar álbuns da galeria:', err.message);
    return [];
  }
}

export async function getFotosAlbum(albumId) {
  try {
    const { data } = await api.get(`/galeria/${albumId}/fotos`);
    return data.data;
  } catch (err) {
    console.warn(`Erro ao carregar fotos do álbum ${albumId}:`, err.message);
    return [];
  }
}
