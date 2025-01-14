import React, { useState, useRef, useEffect } from 'react';
import { 
  Users,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
} from 'lucide-react';
import ClientDetails from './ClientDetails';
import { IClient } from '@/interfaces';



interface ClientListProps {
  clients: IClient[];
  onEdit?: (client: IClient) => void;
  onDelete?: (client: IClient) => void;
}

const ClientList: React.FC<ClientListProps> = ({ 
  clients,
  onEdit,
  onDelete
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showDetailsId, setShowDetailsId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="divide-y divide-gray-100">
      {clients.map((client) => (
        <div
          key={client.id}
          className="group hover:bg-gray-50/80 transition-colors"
        >
          {/* En-tête du client */}
          <div className="p-5 flex items-center justify-between">
            <div 
              className="flex items-center gap-6 flex-1 cursor-pointer"
              onClick={() => toggleExpand(client.id)}
            >
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                <Users className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-900">
                  {client.nom}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {client.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {client.email}
                    </span>
                  )}
                  {client.telephone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {client.telephone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="hidden group-hover:flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowDetailsId(client.id)}
              >
                <Eye className="w-4 h-4" />
                <span className="hidden lg:inline">Détails</span>
              </button>

              {/* Dropdown personnalisé */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdownId(openDropdownId === client.id ? null : client.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {openDropdownId === client.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(client);
                          setOpenDropdownId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                    )}
                    {onDelete && (
                      <>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => {
                            onDelete(client);
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  expandedId === client.id ? 'rotate-90' : ''
                }`}
              />
            </div>
          </div>

          {/* Détails du client */}
          {expandedId === client.id && (
            <div className="border-t border-gray-100">
              <ClientDetails client={client} />
            </div>
          )}
        </div>
      ))}

      {/* Modal de détails */}
      {showDetailsId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Détails du client</h2>
              <button
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowDetailsId(null)}
              >
                Fermer
              </button>
            </div>
            <div className="p-6">
              <ClientDetails 
                client={clients.find(c => c.id === showDetailsId)!}
                expanded
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;