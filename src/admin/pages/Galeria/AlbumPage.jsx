import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById, uploadAlbumFotos, deleteAlbumFoto, setAlbumFotoCapa } from '../../services/galeria.service';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function AlbumPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchAlbum = () => {
    setLoading(true);
    getAlbumById(id)
      .then((res) => {
        setAlbum(res);
        setFotos(res.fotos || []);
      })
      .catch(() => toast.error('Álbum não encontrado.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const handleUpload = async (files) => {
    setUploading(true);
    try {
      const updatedFotos = await uploadAlbumFotos(id, files);
      setFotos(updatedFotos);
      toast.success('Fotos enviadas com sucesso.');
    } catch {
      toast.error('Erro ao enviar fotos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFoto = async (fotoId) => {
    try {
      await deleteAlbumFoto(id, fotoId);
      setFotos((prev) => prev.filter((f) => f.id !== fotoId));
      toast.success('Foto removida.');
    } catch {
      toast.error('Erro ao remover foto.');
    }
  };

  const handleSetCapa = async (fotoId) => {
    try {
      await setAlbumFotoCapa(id, fotoId);
      setFotos((prev) =>
        prev.map((f) => ({
          ...f,
          is_capa: f.id === fotoId,
        }))
      );
      toast.success('Foto definida como capa do álbum.');
    } catch {
      toast.error('Erro ao definir foto de capa.');
    }
  };

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Carregando álbum...</div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/admin/galeria')} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">{album?.nome}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{album?.descricao || 'Sem descrição'}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.25rem' }}>Upload de Fotos</h3>
        <ImageUpload
          existingImages={fotos}
          onUpload={handleUpload}
          onDelete={handleDeleteFoto}
          onSetPrincipal={handleSetCapa}
          loading={uploading}
        />
      </div>
    </div>
  );
}
