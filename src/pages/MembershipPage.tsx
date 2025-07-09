import React, { useState, useEffect } from 'react';
import { membershipService, Membership } from '../services/membershipService';
import { useAuth } from '../hooks/useAuth';
import MembershipHero from '../features/membership/MembershipHero';
import MembershipCardsList from '../features/membership/MembershipCardsList';
import FeaturesComparisonTable from '../features/membership/FeaturesComparisonTable';
import BenefitsSection from '../features/membership/BenefitsSection';
import FAQSection from '../features/membership/FAQSection';
import MembershipCTA from '../features/membership/MembershipCTA';
import { paymentService } from '../services/paymentService';

const MembershipPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMembership, setEditMembership] = useState<Membership | null>(null);
  const [form, setForm] = useState<Partial<Membership>>({ name: '', price: 0, features: [] });
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, [billingCycle]);

  const fetchMemberships = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await membershipService.getMemberships();
      setMemberships(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditMembership(null);
    setForm({ name: '', price: 0, features: [] });
    setShowModal(true);
  };

  const handleEdit = (membership: Membership) => {
    setEditMembership(membership);
    setForm({ ...membership });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this membership?')) return;
    try {
      await membershipService.deleteMembership(id);
      fetchMemberships();
    } catch (e: any) {
      alert(e.message || 'Failed to delete membership');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMembership) {
        await membershipService.updateMembership(editMembership._id!, form);
      } else {
        await membershipService.createMembership(form);
      }
      setShowModal(false);
      fetchMemberships();
    } catch (e: any) {
      alert(e.message || 'Failed to save membership');
    }
  };

  const handleUpgrade = async (planId: string) => {
    setPaymentStatus(null);
    try {
      setPaymentStatus('Processing payment...');
      const res = await paymentService.payForMembership(planId);
      if (res.success) {
        setPaymentStatus('Payment successful! Membership activated.');
        fetchMemberships();
      } else {
        setPaymentStatus(res.message || 'Payment failed.');
      }
    } catch (e: any) {
      setPaymentStatus(e.message || 'Payment failed.');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading membership plans...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error loading plans: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <MembershipHero billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleCreate}
            >
              + Create Membership
            </button>
          </div>
        )}
        {paymentStatus && <div className="text-center text-blue-600 mb-2">{paymentStatus}</div>}
        <MembershipCardsList
          memberships={memberships}
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          onSelectPlan={setSelectedPlan}
          onUpgrade={handleUpgrade}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          isAdmin={isAdmin}
          isCurrent={membership => user?.membershipId === membership._id}
        />
        <FeaturesComparisonTable memberships={memberships} />
        <BenefitsSection />
        <FAQSection />
        <MembershipCTA />
      </div>
      {/* Membership Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editMembership ? 'Edit Membership' : 'Create Membership'}</h2>
            <input
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Name"
              value={form.name || ''}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Price"
              type="number"
              value={form.price || 0}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              required
            />
            <input
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Features (comma separated)"
              value={form.features?.join(', ') || ''}
              onChange={e => setForm(f => ({ ...f, features: e.target.value.split(',').map(t => t.trim()) }))}
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;