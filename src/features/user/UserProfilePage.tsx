import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';

const UserProfilePage: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await userService.updateProfile(profile);
      setFeedback('Profile updated successfully.');
      checkAuth();
    } catch (e: any) {
      setFeedback(e.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    if (passwords.new !== passwords.confirm) {
      setFeedback('New passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      await userService.changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
      setFeedback('Password changed successfully.');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (e: any) {
      setFeedback(e.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-20 text-red-600">Please log in to view your profile.</div>;

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {feedback && <div className="text-green-600 mb-2">{feedback}</div>}
      <form onSubmit={handleProfileSubmit} className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Profile Info</h2>
        <input
          className="w-full mb-3 px-3 py-2 border rounded"
          name="name"
          placeholder="Name"
          value={profile?.name || ''}
          onChange={handleProfileChange}
          required
        />
        <input
          className="w-full mb-3 px-3 py-2 border rounded"
          name="email"
          placeholder="Email"
          value={profile?.email || ''}
          onChange={handleProfileChange}
          required
        />
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>Save</button>
        </div>
      </form>
      <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <input
          className="w-full mb-3 px-3 py-2 border rounded"
          name="current"
          type="password"
          placeholder="Current Password"
          value={passwords.current}
          onChange={handlePasswordChange}
          required
        />
        <input
          className="w-full mb-3 px-3 py-2 border rounded"
          name="new"
          type="password"
          placeholder="New Password"
          value={passwords.new}
          onChange={handlePasswordChange}
          required
        />
        <input
          className="w-full mb-3 px-3 py-2 border rounded"
          name="confirm"
          type="password"
          placeholder="Confirm New Password"
          value={passwords.confirm}
          onChange={handlePasswordChange}
          required
        />
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>Change Password</button>
        </div>
      </form>
    </div>
  );
};

export default UserProfilePage;