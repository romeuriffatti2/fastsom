/**
 * Formata URLs de imagens, garantindo que caminhos relativos do backend (ex: /uploads/...)
 * sejam prefixados com a URL da API (http://localhost:3001) e codificados corretamente.
 * Preserva URLs completas (http/https), data URLs e blobs de pré-visualização.
 */
export function getImageUrl(url) {
  if (!url) return '';
  if (
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    return encodeURI(url);
  }

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
  const backendHost = apiBase.replace(/\/api\/v1\/?$/, '');
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return encodeURI(`${backendHost}${cleanUrl}`);
}
