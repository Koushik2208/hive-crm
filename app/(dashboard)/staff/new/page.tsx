import PageContainer from '@/components/layout/PageContainer';
import StaffForm from '@/components/staff/StaffForm';

export const metadata = {
  title: 'Add Staff Member | Aura Velvet',
  description: 'Create a new staff profile in the Aura Velvet CRM.',
};

export default function NewStaffPage() {
  return (
    <PageContainer scrollable={true} className="">
      <StaffForm />
    </PageContainer>
  );
}
