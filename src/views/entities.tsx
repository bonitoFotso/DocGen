import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { IEntity } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import { useEntity } from '../contexts/EntityContext';

const columns: ColumnDef<IEntity>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const entity = row.original;
      function handleEdit(entity: IEntity): void {
        console.log(`Editing entity with ID ${entity.id}.`);
        throw new Error('Function not implemented.');
      }

      function handleDelete(id: number): void {
        console.log(`Entity with ID ${id} deleted.`);
        throw new Error('Function not implemented.');
      }

      return (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEdit(entity)}
            className="p-2 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(entity.id)}
            className="p-2 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];


export function Entities() {
  
  const { entities } = useEntity();




  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Entities</h1>
        
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <DataTable columns={columns} data={entities} />
      </div>

    
    </div>
  );
}