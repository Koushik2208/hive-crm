import { LayoutGrid, List } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface StaffFilterBarProps {
  role: string;
  status: string;
  branch: string;
  onFilterChange: (key: string, value: string) => void;
}

export default function StaffFilterBar({
  role,
  status,
  branch,
  onFilterChange,
}: StaffFilterBarProps) {

  return (
    <div className="bg-surface-container-low p-2 rounded-2xl flex flex-wrap items-center gap-2">
      <FilterDropdown
        label="Role"
        value={role}
        options={['All Roles', 'Manager', 'Lead Esthetician', 'Senior Stylist', 'Stylist']}
        onSelect={(val: string) => onFilterChange('role', val)}
      />
      <FilterDropdown
        label="Status"
        value={status}
        options={['Active', 'Inactive', 'All Status']}
        onSelect={(val: string) => onFilterChange('status', val)}
      />
      <FilterDropdown
        label="Branch"
        value={branch}
        options={['The Sanctuary Main', 'West Side Loft', 'All Branches']}
        onSelect={(val: string) => onFilterChange('branch', val)}
      />

      <div className="ml-auto flex items-center gap-2 pr-2">
        <FilterDropdown
          label="Sort By"
          value="Name (A-Z)"
          options={['Name (A-Z)', 'Last Action', 'Performance']}
          onSelect={() => { }}
        />
      </div>
    </div>
  );
}

