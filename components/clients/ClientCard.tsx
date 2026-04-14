'use client';

import React from 'react';
import { Phone, Mail, Calendar, MoreVertical } from 'lucide-react';
import { Client } from '@/lib/mockData';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const initials = `${client.first_name[0]}${client.last_name[0]}`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0px_12px_32px_rgba(78,68,73,0.06)] hover:shadow-[0px_12px_32px_rgba(78,68,73,0.12)] transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#d1c3c9]/20">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {client.avatar_url ? (
            <img 
              src={client.avatar_url} 
              alt={`${client.first_name} ${client.last_name}`}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#eedbff] flex items-center justify-center text-[#6c538b] font-bold text-lg">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-[#32172a] font-headline">
              {client.first_name} {client.last_name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {client.tags.map((tag) => (
                <span 
                  key={tag}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tag === 'VIP' 
                      ? 'bg-[#f3e0c0] text-[#231a06]' 
                      : 'bg-[#ffd8ee] text-[#2d1225]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-[#f4f3f1] rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-[#4e4449]/40" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-[#4e4449]/80">
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium">{client.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-[#4e4449]/80">
          <Mail className="w-4 h-4" />
          <span className="text-sm font-medium truncate max-w-[200px]">{client.email}</span>
        </div>
        <div className="flex items-center gap-3 text-[#4e4449]/80">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Last Visit: {client.last_visit}</span>
        </div>
      </div>

      <div className="bg-[#f4f3f1]/50 p-4 rounded-xl">
        <p className="text-xs text-[#4e4449]/60 uppercase tracking-widest font-bold mb-2">Notes</p>
        <p className="text-sm text-[#4e4449] line-clamp-2 leading-relaxed">
          {client.notes}
        </p>
      </div>
    </div>
  );
};

export default ClientCard;
