declare module '../services/membershipService' {
  import { Membership } from './membership';
  export function getMemberships(): Promise<Membership[]>;
  export function getMembershipById(membershipId: string): Promise<Membership>;
  export function createMembership(data: MembershipFormData): Promise<Membership>;
  export function updateMembership(membershipId: string, data: MembershipFormData): Promise<Membership>;
  export function deleteMembership(membershipId: string): Promise<void>;
}
