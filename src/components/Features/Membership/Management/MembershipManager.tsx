import React, { useState } from 'react';
import { useMemberships, useMembershipByUser, useUpdateMembership, useCancelMembership } from '../../../../hooks/useMembership';

// Define an interface that matches the backend data structure for memberships
interface MembershipData {
  _id?: string;
  userId: string;
  planId: string;
  startDate: string;
  status?: string;
}

interface MembershipManagerProps {
  userId: string;
  isAdmin?: boolean;
}

const MembershipManager: React.FC<MembershipManagerProps> = ({ userId, isAdmin = false }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // Fetch membership data
  const { data: memberships, isLoading: isLoadingMemberships } = useMemberships();
  const { data: userMembership, isLoading: isLoadingUserMembership, refetch } = useMembershipByUser(userId);

  // Mutation hooks
  const updateMembershipMutation = useUpdateMembership();
  const cancelMembershipMutation = useCancelMembership();

  const handleUpdateMembership = async () => {
    if (!selectedPlan) return;

    try {
      await updateMembershipMutation.mutateAsync({
        userId,
        planId: selectedPlan,
        startDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      });
      refetch(); // Refresh membership data
      alert('Membership updated successfully');
    } catch (error) {
      console.error('Error updating membership:', error);
      alert('Failed to update membership');
    }
  };

  const handleCancelMembership = async () => {
    if (!window.confirm('Are you sure you want to cancel your membership?')) return;

    try {
      await cancelMembershipMutation.mutateAsync(userId);
      refetch(); // Refresh membership data
      alert('Membership cancelled successfully');
    } catch (error) {
      console.error('Error cancelling membership:', error);
      alert('Failed to cancel membership');
    }
  };

  if (isLoadingMemberships || isLoadingUserMembership) {
    return <div>Loading membership information...</div>;
  }

  return (
    <div className="membership-manager p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Membership Management</h2>

      {/* Display current membership status */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Current Membership</h3>
        {userMembership ? (
          <div>
            <p>Plan: {userMembership.planId}</p>
            <p>Start Date: {userMembership.startDate}</p>
            <p>Status: {userMembership.status || 'active'}</p>
          </div>
        ) : (
          <p>No active membership found.</p>
        )}
      </div>

      {/* Admin view - show all memberships */}
      {isAdmin && memberships && memberships.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">All Memberships (Admin View)</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberships.map((membership: MembershipData) => (
                <tr key={membership.userId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{membership.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{membership.planId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{membership.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{membership.status || 'active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Membership plan selection and update */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Update Membership Plan</h3>
        <div className="mb-4">
          <label htmlFor="plan-select" className="block text-sm font-medium text-gray-700 mb-1">Select Plan:</label>
          <select 
            id="plan-select"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            <option value="">-- Select a Plan --</option>
            <option value="basic">Basic Plan</option>
            <option value="premium">Premium Plan</option>
            <option value="enterprise">Enterprise Plan</option>
          </select>
        </div>
        <button
          onClick={handleUpdateMembership}
          disabled={!selectedPlan || updateMembershipMutation.isPending}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(!selectedPlan || updateMembershipMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {updateMembershipMutation.isPending ? 'Updating...' : 'Update Membership'}
        </button>
      </div>

      {/* Cancel membership */}
      {userMembership && userMembership.status !== 'cancelled' && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Cancel Membership</h3>
          <p className="text-sm text-gray-600 mb-3">Cancelling your membership will end all benefits associated with your plan.</p>
          <button
            onClick={handleCancelMembership}
            disabled={cancelMembershipMutation.isPending}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${cancelMembershipMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cancelMembershipMutation.isPending ? 'Cancelling...' : 'Cancel Membership'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MembershipManager;
