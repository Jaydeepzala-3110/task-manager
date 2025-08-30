import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import AdminDashboard from '../admindashboard';
import MemberDashboard from '../memberdashboard';

const DashboardRouter = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
      return;
    }

    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard';
    navigate(redirectPath, { replace: true });
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">User not authenticated</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  return user.role === 'admin' ? <AdminDashboard /> : <MemberDashboard />;
};

export default DashboardRouter;
