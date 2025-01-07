import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { ISite } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import ButtonModal from '../components/ui/buttonModal';
import { SiteForm } from '../components/forms/SiteForm';
import { useSite } from '../contexts/SiteContext';

const columns: ColumnDef<ISite>[] = [
  {
    accessorKey: 'nom',
    header: 'Name',
  },
  {
    accessorKey: 'client.nom',
    header: 'Client',
  },
  {
    accessorKey: 'localisation',
    header: 'Location',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <div className="flex space-x-2">
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


export function Sites() {

  

  const {sites } = useSite();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
      
        <h1 className="text-2xl font-semibold text-gray-900">Sites</h1>
        <ButtonModal title="Creer un Site">
        <SiteForm />
        </ButtonModal>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <DataTable columns={columns} data={sites} />
      </div>
    </div>
  );
}


