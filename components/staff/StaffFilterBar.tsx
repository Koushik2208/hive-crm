import { LayoutGrid, List } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface StaffFilterBarProps {
  role: string;
  status: string;
  branch: string;
  viewMode: 'grid' | 'list';
  onFilterChange: (key: string, value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function StaffFilterBar({
  role,
  status,
  branch,
  viewMode,
  onFilterChange,
  onViewModeChange
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
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-secondary bg-secondary/5' : 'text-on-surface-variant/40 hover:bg-surface-container-high'
            }`}
        >
          <LayoutGrid size={20} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'text-secondary bg-secondary/5' : 'text-on-surface-variant/40 hover:bg-surface-container-high'
            }`}
        >
          <List size={20} />
        </button>
      </div>
    </div>
  );
}

