'use client';

import React from 'react';
import { Phone, Mail, Calendar, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { Client } from '@/types/clients';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const router = useRouter();
  const firstName = client.first_name || '';
  const lastName = client.last_name || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;

  // Structured data access
  const medicalFlags = (client.medical_flags as any) || {};
  const allergies = medicalFlags.allergies || [];
  const beautyNotes = (client.beauty_notes as any) || {};
  const preferredStylist = beautyNotes.preferred_stylist || '';

  return (
    <div
      onClick={() => router.push(`/clients/${client.id}`)}
      className="bg-white p-6 rounded-xl shadow-ambient hover:shadow-ambient-hover transition-all duration-300 group cursor-pointer border border-transparent hover:border-outline-variant/20 h-full flex flex-col relative overflow-hidden"
    >
      {/* Medical Alert Ribbon */}
      {allergies.length > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-br-lg shadow-sm">
          <ShieldAlert size={10} />
          Medical Alert: {allergies.join(', ')}
        </div>
      )}

      <div className="flex justify-between items-start mb-4 mt-2">
        <div className="flex items-center gap-4">
          {client.avatar_url ? (
            <img
              src={client.avatar_url}
              alt={`${client.first_name} ${client.last_name}`}
              className="w-14 h-14 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#eedbff] flex items-center justify-center text-secondary font-bold text-lg">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-primary font-headline">
              {firstName} {lastName}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {(client.tags || []).map((tag) => (
                <span
                  key={tag}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tag === 'VIP' || tag === 'vip'
                    ? 'bg-[#f3e0c0] text-[#231a06]'
                    : 'bg-[#ffd8ee] text-[#2d1225]'
                    }`}
                >
                  {tag}
                </span>
              ))}
              {!client.is_active && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-outline-variant/30 text-outline">
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-[#4e4449]/80">
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium">{client.phone || 'No phone'}</span>
        </div>
        <div className="flex items-center gap-3 text-[#4e4449]/80">
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium truncate max-w-[200px]">{client.email || 'No email'}</span>
        </div>
        <div className="flex items-center gap-3 text-[#4e4449]/80">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            Joined: {client.created_at ? format(new Date(client.created_at), 'MMM dd, yyyy') : 'Recently'}
          </span>
        </div>
        {preferredStylist && (
          <div className="flex items-center gap-3 text-secondary/70">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Stylist: {preferredStylist}</span>
          </div>
        )}
      </div>

      <div className="bg-surface-container-low/50 p-4 rounded-xl flex-1">
        <p className="text-xs text-[#4e4449]/60 uppercase tracking-widest font-bold mb-2">Notes</p>
        <p className="text-sm text-[#4e4449] line-clamp-2 leading-relaxed">
          {client.notes || 'No notes available'}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/10 flex justify-end">
        <Link href={`/clients/${client.id}`} onClick={(e) => e.stopPropagation()}>
          <button className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline transition-all group/btn">
            View Profile
            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ClientCard;
