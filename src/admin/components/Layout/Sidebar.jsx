import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Package,
  Image,
  Mail,
  Send,
  FileText,
  Settings,
  Users,
  ShieldAlert,
} from 'lucide-react';

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        ⚡ Fastsom CMS
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        <NavLink to="/admin/locacoes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Package size={20} /> Locações
        </NavLink>

        <NavLink to="/admin/galeria" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Image size={20} /> Galeria
        </NavLink>

        <NavLink to="/admin/newsletter" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Mail size={20} /> Newsletter / Contatos
        </NavLink>

        <NavLink to="/admin/campanhas" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Send size={20} /> Campanhas
        </NavLink>

        <NavLink to="/admin/templates" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FileText size={20} /> Templates HTML
        </NavLink>

        {isAdmin && (
          <>
            <div style={{ margin: '1rem 0 0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Administração
            </div>

            <NavLink to="/admin/configuracoes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Settings size={20} /> Configurações
            </NavLink>

            <NavLink to="/admin/usuarios" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={20} /> Usuários
            </NavLink>

            <NavLink to="/admin/logs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={20} /> Audit Logs
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
