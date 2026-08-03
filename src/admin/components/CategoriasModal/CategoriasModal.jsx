import { useState, useEffect } from 'react';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../../services/categorias.service';
import toast from 'react-hot-toast';
import { X, Plus, Edit2, Trash2, Check, Tag } from 'lucide-react';

export default function CategoriasModal({ isOpen, onClose, onCategoryCreated }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nomeNova, setNomeNova] = useState('');
  const [adding, setAdding] = useState(false);

  // Estado de edição inline
  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch {
      toast.error('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
      setNomeNova('');
      setEditId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nomeNova.trim()) return;

    setAdding(true);
    try {
      const created = await createCategoria({ nome: nomeNova.trim() });
      toast.success(`Categoria "${created.nome}" criada com sucesso!`);
      setNomeNova('');
      await fetchCategorias();
      if (onCategoryCreated) {
        onCategoryCreated(created);
      }
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Erro ao criar categoria.');
    } finally {
      setAdding(false);
    }
  };

  const handleStartEdit = (cat) => {
    setEditId(cat.id);
    setEditNome(cat.nome);
  };

  const handleSaveEdit = async (id) => {
    if (!editNome.trim()) return;
    setSavingEdit(true);
    try {
      await updateCategoria(id, { nome: editNome.trim() });
      toast.success('Categoria atualizada com sucesso.');
      setEditId(null);
      await fetchCategorias();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Erro ao atualizar categoria.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat._count?.locacoes > 0) {
      if (!window.confirm(`Esta categoria possui ${cat._count.locacoes} equipamento(s) vinculado(s). Deseja excluí-la mesmo assim?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Deseja excluir a categoria "${cat.nome}"?`)) {
        return;
      }
    }

    try {
      await deleteCategoria(cat.id);
      toast.success('Categoria excluída.');
      await fetchCategorias();
    } catch {
      toast.error('Erro ao excluir categoria.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div className="card" style={{
        maxWidth: '540px',
        width: '92%',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1.5rem',
      }}>
        {/* HEADER MODAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={22} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Gerenciar Categorias</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.375rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* FORM ADICIONAR */}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Nome da nova categoria..."
            value={nomeNova}
            onChange={(e) => setNomeNova(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={adding || !nomeNova.trim()}>
            <Plus size={18} /> {adding ? 'Criando...' : 'Adicionar'}
          </button>
        </form>

        {/* LISTA DE CATEGORIAS */}
        <div style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '360px',
          paddingRight: '4px',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              Carregando categorias...
            </div>
          ) : categorias.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              Nenhuma categoria cadastrada.
            </div>
          ) : (
            categorias.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}
              >
                {editId === cat.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flex: 1, marginRight: '0.5rem' }}>
                    <input
                      type="text"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      autoFocus
                      style={{ flex: 1, padding: '0.375rem 0.625rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat.id)}
                      className="btn btn-primary"
                      disabled={savingEdit}
                      style={{ padding: '0.375rem 0.625rem' }}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="btn btn-secondary"
                      style={{ padding: '0.375rem 0.625rem' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cat.nome}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-muted)',
                      }}>
                        {cat._count?.locacoes || 0} produto(s)
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="btn btn-secondary"
                        style={{ padding: '0.375rem 0.5rem' }}
                        title="Editar nome"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="btn btn-danger"
                        style={{ padding: '0.375rem 0.5rem' }}
                        title="Excluir categoria"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
