import { DataTable } from '../components/ui/data-table';
import { ClientForm } from '../components/forms/client-form';
import type { ColumnDef } from '@tanstack/react-table';
import type { IClient } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import { useClient } from '../contexts/ClientContext';
import ButtonModal from '../components/ui/buttonModal';

const columns: ColumnDef<IClient>[] = [
  {
    accessorKey: 'nom',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'telephone',
    header: 'Phone',
  },
  {
    accessorKey: 'adresse',
    header: 'Address',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const client = row.original;
      function handleEdit(client: IClient): void {
        console.log(`Client avec ID ${client.id} édité.`);
        throw new Error('Function not implemented.');
      }

      function handleDelete(id: number): void {
        console.log(`Client avec ID ${id} supprimée.`);
        throw new Error('Function not implemented.');
      }

      return (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEdit(client)}
            className="p-2 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(client.id)}
            className="p-2 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];



export function Clients() {
  const { clients } = useClient();

  

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <ButtonModal title="Creer un client">
        <ClientForm />
        </ButtonModal>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <DataTable columns={columns} data={clients} />
      </div>

      
      
    </div>
  );
}