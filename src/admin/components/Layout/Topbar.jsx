import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/auth.service';
import { LogOut, User as UserIcon, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Topbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignora erro
    } finally {
      clearAuth();
      toast.success('Sessão encerrada com sucesso.');
      navigate('/admin/login');
    }
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Painel de Gestão
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
          <Globe size={14} /> Ver Landing Page
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
          }}>
            <UserIcon size={20} />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.nome || 'Usuário'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.role === 'ADMIN' ? 'Administrador' : 'Editor'}
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-secondary" title="Sair do sistema">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </header>
  );
}
