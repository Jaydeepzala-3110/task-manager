import { useState } from 'react';
import { X, Shield, Check } from 'lucide-react';
import adminService from '../services/adminService';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

interface UserRoleUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateSuccess: () => void;
}

const UserRoleUpdateModal = ({ isOpen, onClose, user, onUpdateSuccess }: UserRoleUpdateModalProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'member', label: 'Team Member', description: 'Limited access' },
  ];

  const handleUpdate = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (selectedRole === user.role) {
      setError('Please select a different role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await adminService.updateUserRoleAdmin(user._id, selectedRole);
      if (response.success) {
        onUpdateSuccess();
        onClose();
      } else {
        setError(response.message || 'Failed to update user role');
      }
    } catch (error) {
      setError('Failed to update user role. Please try again.');
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
          <h2 className="text-xl font-bold text-white">Update User Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">{user.username}</h3>
          <p className="text-gray-300 text-sm mb-2">
            <span className="text-gray-400">Email:</span> {user.email}
          </p>
          <p className="text-gray-300 text-sm mb-2">
            <span className="text-gray-400">Current Role:</span>{' '}
            <span className={`px-2 py-1 rounded-full text-xs ${
              user.role === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {user.role}
            </span>
          </p>
          <p className="text-gray-300 text-sm">
            <span className="text-gray-400">Status:</span>{' '}
            <span className={`px-2 py-1 rounded-full text-xs ${
              user.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {user.status}
            </span>
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select New Role
          </label>
          <div className="space-y-3">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === role.value
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-gray-400" />
                    <span className="font-medium text-white">{role.label}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{role.description}</p>
                </div>
              </label>
            ))}
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
            onClick={handleUpdate}
            disabled={loading || selectedRole === user.role}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Check size={20} />
                <span>Update Role</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleUpdateModal;
