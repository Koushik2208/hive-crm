'use client';

import React, { useState } from 'react';
import { useServiceCategories, useUpdateCategory, useDeleteCategory, useServices } from '@/hooks/useServices';
import { Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';

const PREDEFINED_COLORS = [
  '#32172a', '#6c538b', '#f3e0c0', '#4a2c40', '#d1c3c9', '#9e8b7d'
];

export function CategoryManager() {
  const { data: categoriesData } = useServiceCategories();
  const { data: servicesData } = useServices();
  const categories = categoriesData?.data || [];
  const services = servicesData?.data || [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleStartEdit = (category: any) => {
    setEditingId(category.id);
    setEditName(category.name || '');
    setEditColor(category.color_hex || PREDEFINED_COLORS[0]);
    setConfirmDeleteId(null);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    updateCategory({
      id: editingId,
      data: { name: editName, color_hex: editColor }
    }, {
      onSuccess: () => setEditingId(null)
    });
  };

  const handleDelete = (id: string) => {
    deleteCategory(id, {
      onSuccess: () => setConfirmDeleteId(null)
    });
  };

  const getServiceCount = (categoryId: string) => {
    return services.filter(s => s.category_id === categoryId).length;
  };

  return (
    <div className="flex flex-col gap-6">
      {categories.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-on-surface-variant/40 italic">No categories created yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const isEditing = editingId === category.id;
            const isDeleting = confirmDeleteId === category.id;
            const serviceCount = getServiceCount(category.id);

            return (
              <div
                key={category.id}
                className={`
                  p-5 rounded-4xl transition-all duration-300 group
                  ${isEditing ? 'bg-surface-container-high ring-1 ring-secondary/20 shadow-lg' : 'bg-surface-container-low hover:bg-surface-container'}
                `}
              >
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-primary/40 ml-1">Category Name</label>
                      <input
                        className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-primary font-bold focus:outline-none focus:border-secondary transition-colors"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-primary/40 ml-1">Color Indicator</label>
                      <div className="flex flex-wrap gap-4 pt-1">
                        {PREDEFINED_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => setEditColor(color)}
                            className={`w-8 h-8 rounded-full transition-transform ${editColor === color ? 'ring-2 ring-primary ring-offset-2 scale-90' : 'hover:scale-110'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-2">
                      <button onClick={() => setEditingId(null)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                        <X size={20} />
                      </button>
                      <button onClick={handleSaveEdit} className="p-2 bg-primary text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-md">
                        <Check size={20} />
                      </button>
                    </div>
                  </div>
                ) : isDeleting ? (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex items-start gap-3 text-error">
                      <AlertCircle className="shrink-0 mt-0.5" size={20} />
                      <div className="space-y-1">
                        <p className="font-bold text-sm">Delete "{category.name}"?</p>
                        <p className="text-xs opacity-70 leading-relaxed">
                          {serviceCount > 0
                            ? `${serviceCount} services will be moved to "Uncategorized". This action is permanent.`
                            : "This category is empty and safe to delete."
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-1">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="px-4 py-2 bg-error text-white text-xs font-bold rounded-full hover:bg-error/90 transition-colors shadow-sm"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full shadow-inner"
                        style={{ backgroundColor: category.color_hex || '#d1c3c9' }}
                      />
                      <div>
                        <p className="text-lg font-bold text-primary tracking-tight leading-none">{category.name}</p>
                        <p className="text-[10px] text-on-surface-variant/50 font-medium uppercase tracking-[0.05em] mt-1.5">
                          {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(category)}
                        className="p-2.5 text-on-surface-variant/40 hover:text-primary hover:bg-surface-container-highest rounded-full transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(category.id)}
                        className="p-2.5 text-on-surface-variant/40 hover:text-error hover:bg-error-container/10 rounded-full transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
