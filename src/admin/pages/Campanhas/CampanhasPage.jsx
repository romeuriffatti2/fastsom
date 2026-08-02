import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCampanhas, deleteCampanha, dispararCampanha } from '../../services/campanhas.service';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { Plus, Send, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CampanhasPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [dispararId, setDispararId] = useState(null);
  const navigate = useNavigate();

  const fetchCampanhas = (page = 1) => {
    setLoading(true);
    getCampanhas({ page, limit: 10 })
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
    fetchCampanhas(1);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCampanha(deleteId);
      toast.success('Campanha excluída.');
      setDeleteId(null);
      fetchCampanhas(pagination.page);
    } catch {
      toast.error('Erro ao excluir campanha.');
    }
  };

  const handleDisparar = async () => {
    if (!dispararId) return;
    try {
      await dispararCampanha(dispararId);
      toast.success('Disparo da campanha iniciado!');
      setDispararId(null);
      fetchCampanhas(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Erro ao disparar campanha.');
    }
  };

  const columns = [
    { label: 'Campanha', key: 'nome', render: (r) => <span style={{ fontWeight: 600 }}>{r.nome}</span> },
    { label: 'Assunto', key: 'assunto' },
    { label: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      label: 'Disparado / Criado em',
      key: 'created_at',
      render: (r) => (r.enviado_em ? new Date(r.enviado_em).toLocaleDateString('pt-BR') : new Date(r.created_at).toLocaleDateString('pt-BR')),
    },
    {
      label: 'Ações',
      key: 'actions',
      render: (r) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(r.status === 'RASCUNHO' || r.status === 'AGENDADA') && (
            <button onClick={() => setDispararId(r.id)} className="btn btn-primary" style={{ padding: '0.375rem 0.625rem' }}>
              <Send size={16} /> Disparar
            </button>
          )}
          {r.status === 'RASCUNHO' && (
            <>
              <button onClick={() => navigate(`/admin/campanhas/${r.id}`)} className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem' }}>
                <Edit size={16} /> Editar
              </button>
              <button onClick={() => setDeleteId(r.id)} className="btn btn-danger" style={{ padding: '0.375rem 0.625rem' }}>
                <Trash2 size={16} /> Excluir
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Campanhas de E-mail Marketing</h1>
        <button onClick={() => navigate('/admin/campanhas/nova')} className="btn btn-primary">
          <Plus size={18} /> Nova Campanha
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          onPageChange: fetchCampanhas,
        }}
      />

      <ConfirmModal
        isOpen={Boolean(dispararId)}
        title="Disparar Campanha"
        message="Tem certeza que deseja disparar os e-mails desta campanha agora?"
        onConfirm={handleDisparar}
        onCancel={() => setDispararId(null)}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Excluir Campanha"
        message="Tem certeza que deseja excluir esta campanha em rascunho?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
