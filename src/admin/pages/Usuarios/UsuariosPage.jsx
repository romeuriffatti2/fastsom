import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, toggleUserStatus, resetUserSenha } from '../../services/users.service';
import DataTable from '../../components/DataTable/DataTable';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Plus, Edit, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', role: 'EDITOR' });
  const [resetModalId, setResetModalId] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');

  const fetchUsers = (page = 1) => {
    setLoading(true);
    getUsers({ page, limit: 10 })
      .then((res) => {
        setUsers(res.data);
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
    fetchUsers(1);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ nome: '', email: '', senha: '', role: 'EDITOR' });
    setModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingId(u.id);
    setFormData({ nome: u.nome, email: u.email, senha: '', role: u.role });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, { nome: formData.nome, email: formData.email, role: formData.role });
        toast.success('Usuário atualizado.');
      } else {
        await createUser(formData);
        toast.success('Usuário criado.');
      }
      setModalOpen(false);
      fetchUsers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Erro ao salvar usuário.');
    }
  };

  const handleToggleStatus = async (u) => {
    try {
      await toggleUserStatus(u.id, !u.ativo);
      toast.success(`Usuário ${!u.ativo ? 'ativado' : 'desativado'}.`);
      fetchUsers(pagination.page);
    } catch {
      toast.error('Erro ao alterar status.');
    }
  };

  const handleResetSenha = async (e) => {
    e.preventDefault();
    if (!novaSenha) return;
    try {
      await resetUserSenha(resetModalId, novaSenha);
      toast.success('Senha redefinida com sucesso.');
      setResetModalId(null);
      setNovaSenha('');
    } catch {
      toast.error('Erro ao redefinir senha.');
    }
  };

  const columns = [
    { label: 'Nome', key: 'nome', render: (r) => <span style={{ fontWeight: 600 }}>{r.nome}</span> },
    { label: 'E-mail', key: 'email' },
    {
      label: 'Perfil (Role)',
      key: 'role',
      render: (r) => (
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: r.role === 'ADMIN' ? 'rgba(108, 99, 255, 0.2)' : 'rgba(100, 116, 139, 0.2)',
          color: r.role === 'ADMIN' ? '#818cf8' : '#cbd5e1',
        }}>
          {r.role}
        </span>
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
      label: 'Ações',
      key: 'actions',
      render: (r) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => handleOpenEdit(r)} className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem' }}>
            <Edit size={16} /> Editar
          </button>
          <button onClick={() => setResetModalId(r.id)} className="btn btn-secondary" style={{ padding: '0.375rem 0.625rem' }} title="Redefinir Senha">
            <Key size={16} /> Senha
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestão de Usuários do CMS</h1>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} /> Novo Usuário
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          onPageChange: fetchUsers,
        }}
      />

      {/* MODAL FORM USUÁRIO */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '420px', width: '90%' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Nome Completo *</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>E-mail *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              {!editingId && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Senha *</label>
                  <input type="password" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} required minLength={8} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Perfil de Acesso *</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="EDITOR">EDITOR (Acesso operacional ao conteúdo)</option>
                  <option value="ADMIN">ADMINISTRADOR (Acesso total)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL RESET SENHA */}
      {resetModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleResetSenha} className="card" style={{ maxWidth: '360px', width: '90%' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Redefinir Senha do Usuário</h3>
            <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Nova senha (mín. 8 caracteres)" required minLength={8} style={{ marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setResetModalId(null)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary">Redefinir</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
