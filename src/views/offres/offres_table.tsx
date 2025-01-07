import React from "react";
import { useOffre } from "../../contexts/OffreProvider";
import { IOffre } from "../../types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/ui/data-table";
import { Edit, Trash2 } from "lucide-react";

const OffresTable: React.FC = () => {
  const { offres, fetchOffres } = useOffre();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchOffres();
      setLoading(false);
    };
    fetchData();
  }, [fetchOffres]);

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      console.log(`Offre avec ID ${id} supprimée.`);
    }
  };

  const filteredOffres = offres.filter((offre) =>
    Object.values(offre)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<IOffre>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          ID {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
    },
    {
      accessorKey: "reference",
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Référence {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </div>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Catégorie",
    },
    {
      accessorKey: "produit.name",
      header: "Produit",
    },
    {
      accessorKey: "client.nom",
      header: "Client",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex space-x-2">
            <button
              className="p-2 hover:text-blue-600"
              onClick={() => console.log(`Modifier l'offre avec ID ${id}`)}
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              className="p-2 hover:text-red-600"
              onClick={() => handleDelete(id)}
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        {loading ? (
          <div className="text-center py-6">
            <span className="text-gray-500">Chargement des offres...</span>
          </div>
        ) : filteredOffres.length ? (
          <DataTable columns={columns} data={filteredOffres} />
        ) : (
          <div className="text-center py-6 text-gray-500">
            Aucune offre disponible.
          </div>
        )}
      </div>
    </div>
  );
};

export default OffresTable;
