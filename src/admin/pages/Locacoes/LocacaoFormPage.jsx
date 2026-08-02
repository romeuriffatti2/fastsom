import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getLocacaoById,
  createLocacao,
  updateLocacao,
  getCategorias,
  uploadLocacaoImagens,
  deleteLocacaoImagem,
  setLocacaoImagemPrincipal,
} from '../../services/locacoes.service';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Star, CheckCircle } from 'lucide-react';

export default function LocacaoFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    categoria_id: '',
    ativo: true,
    destaque: false,
  });
  const [categorias, setCategorias] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingPreviews, setPendingPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);

    if (isEdit) {
      setLoading(true);
      getLocacaoById(id)
        .then((res) => {
          setFormData({
            nome: res.nome,
            descricao: res.descricao,
            valor: res.valor,
            categoria_id: res.categoria_id || '',
            ativo: res.ativo,
            destaque: res.destaque,
          });
          setImagens(res.imagens || []);
        })
        .catch(() => toast.error('Locação não encontrada.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateLocacao(id, formData);
        toast.success('Locação atualizada com sucesso.');
      } else {
        const created = await createLocacao(formData);
        if (pendingFiles.length > 0) {
          setUploading(true);
          try {
            await uploadLocacaoImagens(created.id, pendingFiles);
          } catch {
            toast.error('Equipamento criado, mas houve um erro ao enviar as imagens.');
          } finally {
            setUploading(false);
          }
        }
        toast.success('Equipamento cadastrado com sucesso!');
        navigate(`/admin/locacoes/${created.id}`);
        return;
      }
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Falha ao salvar locação.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFiles = async (files) => {
    if (!isEdit) {
      // Guarda os arquivos pendentes para enviar após a criação
      const newPending = [...pendingFiles, ...files];
      setPendingFiles(newPending);
      const newPreviews = files.map((file) => ({
        id: URL.createObjectURL(file),
        url: URL.createObjectURL(file),
        is_principal: false,
      }));
      setPendingPreviews([...pendingPreviews, ...newPreviews]);
      toast.success(`${files.length} imagem(ns) selecionada(s). Clique em Salvar para concluir.`);
      return;
    }

    setUploading(true);
    try {
      const updatedImagens = await uploadLocacaoImagens(id, files);
      setImagens(updatedImagens);
      toast.success('Imagens enviadas com sucesso.');
    } catch {
      toast.error('Erro ao enviar imagens.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImagem = async (imgId) => {
    if (!isEdit) {
      setPendingPreviews((prev) => prev.filter((img) => img.id !== imgId));
      return;
    }

    try {
      await deleteLocacaoImagem(id, imgId);
      setImagens((prev) => prev.filter((img) => img.id !== imgId));
      toast.success('Imagem removida.');
    } catch {
      toast.error('Erro ao remover imagem.');
    }
  };

  const handleSetPrincipal = async (imgId) => {
    if (!isEdit) return;

    try {
      await setLocacaoImagemPrincipal(id, imgId);
      setImagens((prev) =>
        prev.map((img) => ({
          ...img,
          is_principal: img.id === imgId,
        }))
      );
      toast.success('Imagem principal definida.');
    } catch {
      toast.error('Erro ao alterar imagem principal.');
    }
  };

  const displayImagens = isEdit ? imagens : pendingPreviews;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/admin/locacoes')} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="page-title">{isEdit ? 'Editar Equipamento' : 'Novo Equipamento'}</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Nome do Equipamento *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              placeholder="Ex: Trave Box Truss 800W"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Categoria
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Valor de Locação (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                required
                placeholder="400.00"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Descrição Detalhada *
            </label>
            <textarea
              rows={5}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              placeholder="Descreva o equipamento, especificações técnicas e o que acompanha o kit..."
            />
          </div>

          {/* CHECKBOXES ESTILIZADOS SEGUNDO O DESIGN SYSTEM */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1.125rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: `1.5px solid ${formData.ativo ? 'var(--color-success)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} color={formData.ativo ? 'var(--color-success)' : 'var(--text-muted)'} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Equipamento Ativo</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visível para locação</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-success)', cursor: 'pointer' }}
              />
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1.125rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: `1.5px solid ${formData.destaque ? 'var(--color-secondary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Star size={20} color={formData.destaque ? 'var(--color-secondary)' : 'var(--text-muted)'} fill={formData.destaque ? 'var(--color-secondary)' : 'none'} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Exibir em Destaque</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Banner da Landing Page</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.destaque}
                onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-secondary)', cursor: 'pointer' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
              <Save size={18} /> {loading || uploading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>

        {/* UPLOAD DE IMAGENS DISPONÍVEL NO NOVO CADASTRO E NA EDIÇÃO */}
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Imagens do Produto</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {isEdit ? 'Gerencie as fotos cadastradas do equipamento.' : 'Selecione fotos para serem enviadas junto com o cadastro.'}
          </p>
          <ImageUpload
            existingImages={displayImagens}
            onUpload={handleUploadFiles}
            onDelete={handleDeleteImagem}
            onSetPrincipal={isEdit ? handleSetPrincipal : null}
            loading={uploading}
          />
        </div>
      </div>
    </div>
  );
}
