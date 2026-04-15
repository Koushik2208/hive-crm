'use client';

import React, { useState } from 'react';
import { useServiceCategories } from '@/hooks/useServices';
import { Settings2, Plus } from 'lucide-react';
import { FilterPill } from '@/components/ui/FilterPill';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import { CategoryForm } from '@/components/services/CategoryForm';
import { CategoryManager } from '@/components/services/CategoryManager';

interface CategoryFilterProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryFilter({ selectedCategoryId, onSelectCategory }: CategoryFilterProps) {
  const { data } = useServiceCategories();
  const categories = data?.data || [];
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-outline-variant/10 pb-10 group/header">
      <div className="flex flex-wrap items-center gap-3">
        <FilterPill
          label="All"
          isActive={selectedCategoryId === 'all'}
          onClick={() => onSelectCategory('all')}
        />
        
        {categories.map((category) => (
          <FilterPill
            key={category.id}
            label={category.name ?? 'Unnamed Category'}
            isActive={selectedCategoryId === category.id}
            colorIndicator={category.color_hex}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}

        {/* Add Category Button - Contextual Plus */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          title="Add new category"
          className="p-2.5 ml-2 rounded-full border border-dashed border-outline-variant/40 hover:border-secondary hover:bg-secondary/5 transition-all active:scale-90 group/add"
        >
          <Plus size={18} className="text-outline-variant group-hover/add:text-secondary transition-colors" />
        </button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsManageDrawerOpen(true)}
        className="flex items-center gap-2 font-bold uppercase tracking-[0.15em] text-[10px] text-primary/60 hover:text-primary hover:bg-surface-container transition-all active:scale-95 px-4 rounded-full border border-outline-variant/10"
      >
        <Settings2 size={16} />
        Manage Categories
      </Button>

      {/* Quick Add Category Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
      >
        <CategoryForm 
          onSuccess={() => setIsAddModalOpen(false)} 
          onCancel={() => setIsAddModalOpen(false)} 
        />
      </Modal>

      {/* Manage Categories Drawer */}
      <Drawer
        isOpen={isManageDrawerOpen}
        onClose={() => setIsManageDrawerOpen(false)}
        title="Manage Categories"
        subtitle={
          <p className="text-sm text-on-surface-variant/60 font-medium">
            Refine your salon menu groupings. Changes update across all services.
          </p>
        }
      >
        <CategoryManager />
      </Drawer>
    </div>
  );
}
