import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked?: boolean;
}

const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id: string, block: boolean) => {
    try {
      await userService.blockUser(id, block);
      setFeedback(block ? 'User blocked.' : 'User unblocked.');
      fetchUsers();
    } catch (e: any) {
      setFeedback(e.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
      setFeedback('User deleted.');
      fetchUsers();
    } catch (e: any) {
      setFeedback(e.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await userService.changeUserRole(id, role);
      setFeedback('User role updated.');
      fetchUsers();
    } catch (e: any) {
      setFeedback(e.message || 'Failed to update role');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) return <div className="text-center py-20 text-red-600">Access denied.</div>;

  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <input
        className="mb-4 px-3 py-2 border rounded w-full"
        placeholder="Search users by name or email"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {feedback && <div className="text-green-600 mb-2">{feedback}</div>}
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </td>
                <td className="p-2">{u.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className="p-2 space-x-2">
                  <button
                    className={`px-2 py-1 rounded ${u.isBlocked ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
                    onClick={() => handleBlock(u._id, !u.isBlocked)}
                  >
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-red-600 text-white"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagementPage;