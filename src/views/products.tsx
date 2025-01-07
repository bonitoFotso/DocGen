import { DataTable } from '../components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { IProduct } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';

const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category.name',
    header: 'Category',
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



export function Products() {

  const { products } = useProduct();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Add Product
        </button>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}