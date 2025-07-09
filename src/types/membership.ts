export interface Membership {
  _id?: string;
  userId: string;
  planId: string;
  planName?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface MembershipFormData {
  userId: string;
  planId: string;
  startDate?: string;
}
