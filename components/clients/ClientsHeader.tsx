import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const ClientsHeader = () => {
  return (
    <header className="flex justify-between items-end">
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.15em] text-secondary uppercase mb-1">
          Relationship Management
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary font-headline">Clients</h1>
      </div>
      <Link href="/clients/new">
        <Button variant="primary" className="px-8 py-3.5 rounded-xl font-bold tracking-tight ambient-shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
          <Plus size={20} />
          Add Client
        </Button>
      </Link>
    </header>
  );
};

export default ClientsHeader;
