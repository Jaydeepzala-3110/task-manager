import { useState, useEffect } from 'react';
import AdminDashboard from '../admindashboard';
import MemberDashboard from '../memberdashboard';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
}

const DashboardRouter = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data - replace with actual API call
    const fetchUser = async () => {
      try {
        // Mock API call - replace with actual authentication logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, you can change this to test different roles
        const mockUser: User = {
          id: '1',
          username: 'johndoe',
          email: 'john@example.com',
          role: 'admin' // Change to 'member' to test Member Dashboard
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Redirect to login if authentication fails
        // window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">User not authenticated</p>
          <button 
            onClick={() => window.location.href = '/login'}
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
