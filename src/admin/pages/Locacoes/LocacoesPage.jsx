import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocacoesAdmin, deleteLocacao, toggleLocacaoStatus, toggleLocacaoDestaque } from '../../services/locacoes.service';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LocacoesPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLocacoes = (page = 1, searchQuery = '') => {
    setLoading(true);
    getLocacoesAdmin({ page, limit: 10, search: searchQuery })
      .then((res) => {
        setData(res.data);
        setPagination({
          page: res.pagination.page,
          totalPages: res.pagination.totalPages,
          total: res.pagination.total,
        });
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocacoes(1, search);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteLocacao(deleteId);
      toast.success('Locação excluída com sucesso.');
      setDeleteId(null);
      fetchLocacoes(pagination.page, search);
    } catch {
      toast.error('Erro ao excluir locação.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      await toggleLocacaoStatus(item.id, !item.ativo);
      toast.success(`Locação ${!item.ativo ? 'ativada' : 'desativada'}.`);
      fetchLocacoes(pagination.page, search);
    } catch {
      toast.error('Erro ao alterar status.');
    }
  };

  const handleToggleDestaque = async (item) => {
    try {
      await toggleLocacaoDestaque(item.id, !item.destaque);
      toast.success(`Destaque ${!item.destaque ? 'ativado' : 'desativado'}.`);
      fetchLocacoes(pagination.page, search);
    } catch {
      toast.error('Erro ao alterar destaque.');
    }
  };

  const columns = [
    {
      label: 'Equipamento',
      key: 'nome',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {row.imagens && row.imagens.length > 0 ? (
            <img src={row.imagens[0].url} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }} />
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{row.nome}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.categoria?.nome || 'Sem categoria'}</div>
          </div>
        </div>
      ),
    },
    {
      label: 'Valor (R$)',
      key: 'valor',
      render: (row) => `R$ ${parseFloat(row.valor).toFixed(2).replace('.', ',')}`,
    },
    {
      label: 'Status',
      key: 'ativo',
      render: (row) => (
        <button onClick={() => handleToggleStatus(row)} style={{ background: 'none' }}>
          <StatusBadge status={row.ativo ? 'ativo' : 'inativo'} />
        </button>
      ),
    },
    {
      label: 'Destaque',
      key: 'destaque',
      render: (row) => (
        <button onClick={() => handleToggleDestaque(row)} style={{ background: 'none', cursor: 'pointer' }}>
          <Star size={18} color={row.destaque ? '#f59e0b' : '#64748b'} fill={row.destaque ? '#f59e0b' : 'none'} />
        </button>
      ),
    },
    {
      label: 'Ações',
      key: 'actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate(`/admin/locacoes/${row.id}`)} className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem' }}>
            <Edit size={16} /> Editar
          </button>
          <button onClick={() => setDeleteId(row.id)} className="btn btn-danger" style={{ padding: '0.375rem 0.625rem' }}>
            <Trash2 size={16} /> Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestão de Locações</h1>
        <button onClick={() => navigate('/admin/locacoes/novo')} className="btn btn-primary">
          <Plus size={18} /> Novo Equipamento
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
          onPageChange: (p) => fetchLocacoes(p, search),
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Excluir Locação"
        message="Tem certeza que deseja excluir esta locação?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
