import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
