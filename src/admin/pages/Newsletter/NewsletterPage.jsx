import { useState, useEffect } from 'react';
import { getContatos, deleteContato, toggleContatoStatus, addContatoTag, removeContatoTag, exportarContatosCSV } from '../../services/newsletter.service';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { Download, Trash2, Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [tagModalId, setTagModalId] = useState(null);
  const [newTag, setNewTag] = useState('');

  const fetchContatos = (page = 1, searchQuery = '') => {
    setLoading(true);
    getContatos({ page, limit: 15, search: searchQuery })
      .then((res) => {
        setData(res.data);
        setPagination({
          page: res.pagination.page,
          totalPages: res.pagination.totalPages,
          total: res.pagination.total,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContatos(1, search);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContato(deleteId);
      toast.success('Contato excluído.');
      setDeleteId(null);
      fetchContatos(pagination.page, search);
    } catch {
      toast.error('Erro ao excluir contato.');
    }
  };

  const handleToggleStatus = async (contato) => {
    try {
      await toggleContatoStatus(contato.id, !contato.ativo);
      toast.success(`Contato ${!contato.ativo ? 'ativado' : 'desativado'}.`);
      fetchContatos(pagination.page, search);
    } catch {
      toast.error('Erro ao alterar status.');
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      await addContatoTag(tagModalId, newTag.trim().toLowerCase());
      toast.success('Tag adicionada.');
      setTagModalId(null);
      setNewTag('');
      fetchContatos(pagination.page, search);
    } catch {
      toast.error('Erro ao adicionar tag.');
    }
  };

  const handleRemoveTag = async (contatoId, tag) => {
    try {
      await removeContatoTag(contatoId, tag);
      toast.success('Tag removida.');
      fetchContatos(pagination.page, search);
    } catch {
      toast.error('Erro ao remover tag.');
    }
  };

  const columns = [
    { label: 'Nome', key: 'nome', render: (r) => <span style={{ fontWeight: 600 }}>{r.nome}</span> },
    { label: 'E-mail', key: 'email' },
    { label: 'Telefone', key: 'telefone', render: (r) => r.telefone || '—' },
    {
      label: 'Tags',
      key: 'tags',
      render: (r) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
          {r.tags?.map((t) => (
            <span key={t.tag} style={{
              backgroundColor: 'var(--bg-tertiary)', padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            }}>
              {t.tag}
              <button onClick={() => handleRemoveTag(r.id, t.tag)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.75rem' }}>×</button>
            </span>
          ))}
          <button onClick={() => setTagModalId(r.id)} style={{ background: 'none', color: 'var(--color-primary)', cursor: 'pointer' }} title="Adicionar Tag">
            <Plus size={14} />
          </button>
        </div>
      ),
    },
    {
      label: 'Status',
      key: 'ativo',
      render: (r) => (
        <button onClick={() => handleToggleStatus(r)} style={{ background: 'none' }}>
          <StatusBadge status={r.ativo ? 'ativo' : 'inativo'} />
        </button>
      ),
    },
    {
      label: 'Cadastro em',
      key: 'created_at',
      render: (r) => new Date(r.created_at).toLocaleDateString('pt-BR'),
    },
    {
      label: 'Ações',
      key: 'actions',
      render: (r) => (
        <button onClick={() => setDeleteId(r.id)} className="btn btn-danger" style={{ padding: '0.375rem 0.625rem' }}>
          <Trash2 size={16} /> Excluir
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Base de Contatos & Newsletter</h1>
        <button onClick={() => exportarContatosCSV()} className="btn btn-secondary">
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          onPageChange: (p) => fetchContatos(p, search),
        }}
      />

      {/* MODAL ADICIONAR TAG */}
      {tagModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleAddTag} className="card" style={{ maxWidth: '360px', width: '90%' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Adicionar Tag</h3>
            <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Ex: vip, evento2026" required autoFocus style={{ marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setTagModalId(null)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary">Adicionar</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Excluir Contato"
        message="Tem certeza que deseja remover este contato da base de e-mails?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
