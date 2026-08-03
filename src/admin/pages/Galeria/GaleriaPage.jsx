import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlbunsAdmin, createAlbum, deleteAlbum, toggleAlbumPublicar } from '../../services/galeria.service';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { getImageUrl } from '../../../utils/imageUrl';
import { Plus, Image, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GaleriaPage() {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAlbuns = () => {
    setLoading(true);
    getAlbunsAdmin()
      .then((res) => setAlbuns(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlbuns();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const created = await createAlbum({ nome, descricao, publicado: false });
      toast.success('Álbum criado com sucesso.');
      setNewModalOpen(false);
      setNome('');
      setDescricao('');
      navigate(`/admin/galeria/${created.id}`);
    } catch {
      toast.error('Erro ao criar álbum.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteAlbum(deleteId);
      toast.success('Álbum excluído com sucesso.');
      setDeleteId(null);
      fetchAlbuns();
    } catch {
      toast.error('Erro ao excluir álbum.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublicar = async (album) => {
    try {
      await toggleAlbumPublicar(album.id, !album.publicado);
      toast.success(`Álbum ${!album.publicado ? 'publicado' : 'despublicado'}.`);
      fetchAlbuns();
    } catch {
      toast.error('Erro ao alterar status.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Galeria de Fotos</h1>
        <button onClick={() => setNewModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Novo Álbum
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Carregando álbuns...</div>
      ) : albuns.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Image size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>Nenhum álbum cadastrado</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Crie o primeiro álbum para exibir fotos de eventos na Landing Page.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {albuns.map((album) => (
            <div key={album.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '180px', backgroundColor: 'var(--bg-tertiary)' }}>
                {album.capa_url ? (
                  <img src={getImageUrl(album.capa_url)} alt={album.nome} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', padding: '4px' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    Sem fotos
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <StatusBadge status={album.publicado ? 'publicado' : 'despublicado'} />
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{album.nome}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {album.total_fotos || 0} foto(s)
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button onClick={() => navigate(`/admin/galeria/${album.id}`)} className="btn btn-secondary" style={{ flex: 1 }}>
                    <Eye size={16} /> Ver / Upload
                  </button>
                  <button onClick={() => handleTogglePublicar(album)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                    {album.publicado ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button onClick={() => setDeleteId(album.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL NOVO ÁLBUM */}
      {newModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <form onSubmit={handleCreate} className="card" style={{ maxWidth: '480px', width: '90%' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Criar Novo Álbum</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Nome do Álbum *</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Casamento Silva & Souza" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Descrição</label>
                <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição do evento..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setNewModalOpen(false)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Criando...' : 'Criar Álbum'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Excluir Álbum"
        message="Tem certeza que deseja excluir este álbum e todas as fotos associadas?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />
    </div>
  );
}
