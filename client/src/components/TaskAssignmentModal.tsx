import { useState, useEffect } from 'react';
import { X, User, Check } from 'lucide-react';
import adminService from '../services/adminService';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onAssignmentSuccess: () => void;
}

const TaskAssignmentModal = ({ isOpen, onClose, task, onAssignmentSuccess }: TaskAssignmentModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && task) {
      fetchUsers();
      setSelectedUserId(task.assignee?._id || '');
    }
  }, [isOpen, task]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsersForAdmin({ limit: 100 });
      if (response.success && response.data) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) {
      setError('Please select a user to assign the task to');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminService.assignTaskToUser(task._id, selectedUserId);
      if (response.success) {
        onAssignmentSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to assign task');
      }
    } catch (error) {
      setError('Failed to assign task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Assign Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Task Info */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
          <p className="text-gray-300 text-sm mb-2">
            <span className="text-gray-400">Current Assignee:</span>{' '}
            {task.assignee?.username || 'Unassigned'}
          </p>
          <p className="text-gray-300 text-sm">
            <span className="text-gray-400">Status:</span>{' '}
            <span className={`px-2 py-1 rounded-full text-xs ${
              task.status === 'done' ? 'bg-green-600 text-white' :
              task.status === 'in-progress' ? 'bg-blue-600 text-white' :
              'bg-yellow-600 text-white'
            }`}>
              {task.status}
            </span>
          </p>
        </div>

        {/* User Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Assign to User
          </label>
          <div className="relative">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || !selectedUserId}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Check size={20} />
                <span>Assign</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentModal;
