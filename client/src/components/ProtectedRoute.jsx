import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user }) => {
  // Agar user object khali hai, toh login par dhakka de do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar authenticated hai, toh jo bhi andar hai (dashboards) wo dikhao
  return <Outlet />;
};

export default ProtectedRoute;