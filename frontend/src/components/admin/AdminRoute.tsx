import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
