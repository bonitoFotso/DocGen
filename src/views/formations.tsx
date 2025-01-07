import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { IFormation } from '../types';
import { Edit, Trash2, Users } from 'lucide-react';
import { format } from 'date-fns';

const columns: ColumnDef<IFormation>[] = [
  {
    accessorKey: 'titre',
    header: 'Title',
  },
  {
    accessorKey: 'client.nom',
    header: 'Client',
  },
  {
    accessorKey: 'date_debut',
    header: 'Start Date',
    cell: ({ row }) => format(new Date(row.original.date_debut), 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'date_fin',
    header: 'End Date',
    cell: ({ row }) => format(new Date(row.original.date_fin), 'dd/MM/yyyy'),
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <div className="flex space-x-2">
          <button className="p-2 hover:text-blue-600">
            <Users className="h-4 w-4" />
          </button>
          <button className="p-2 hover:text-blue-600">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-2 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];

const mockData: IFormation[] = [
  { 
    id: 1,
    titre: 'Formation One',
    client: { id: 1, nom: 'Client One' },
    proforma: {
      id: 1,
      entity: { id: 1, code: 'ABC', name: 'Entity One' },
      reference: 'PRF001',
      client: { id: 1, nom: 'Client One' },
      date_creation: '2024-03-15T10:00:00Z',
      statut: 'VALIDE',
      doc_type: 'PRF',
      sequence_number: 1
    },
    date_debut: '2024-04-01T09:00:00Z',
    date_fin: '2024-04-05T17:00:00Z',
    description: 'Training description'
  },
  // Add more mock data as needed
];

export function Formations() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Formations</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Add Formation
        </button>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <DataTable columns={columns} data={mockData} />
      </div>
    </div>
  );
}