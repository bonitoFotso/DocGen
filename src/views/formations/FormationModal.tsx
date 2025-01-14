/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { X, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAffaire } from '@/contexts/AffaireProviders';
import { IAffaire, IFormation, IProduct } from '@/interfaces';

interface FormationModalProps {
  formation: IFormation | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

type FormValues = {
  affaire_id?: string;
  produit_id?: string;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
};

export default function FormationModal({
  formation,
  isOpen,
  onClose,
  onSubmit
}: FormationModalProps) {
  const { affaires } = useAffaire();
  const [selectedAffaire, setSelectedAffaire] = useState<IAffaire | null>(null);
  const [formationProducts, setFormationProducts] = useState<IProduct[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      titre: formation?.titre || '',
      description: formation?.description || '',
      date_debut: formation ? format(new Date(formation.date_debut), "yyyy-MM-dd'T'HH:mm") : '',
      date_fin: formation ? format(new Date(formation.date_fin), "yyyy-MM-dd'T'HH:mm") : '',
      affaire_id: formation?.affaire.id.toString() || '',
      produit_id: formation?.affaire.offre.produit[0]?.id.toString() || ''
    }
  });

  const affaire_id = watch('affaire_id');

  useEffect(() => {
    if (affaire_id) {
      const affaire = affaires.find(a => a.id.toString() === affaire_id);
      setSelectedAffaire(affaire || null);
      
      // Filter products with category "Formation"
      const formationProds = affaire?.offre.produit.filter(p => p.category.code === 'FOR') || [];
      setFormationProducts(formationProds);

      // Reset product selection if no formation products available
      if (formationProds.length === 0) {
        setValue('produit_id', '');
      }
    }
  }, [affaire_id, affaires, setValue]);

  if (!isOpen) return null;

  const isUpdateMode = !!formation;
  const hasFormationProducts = formationProducts.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {isUpdateMode ? 'Modifier la formation' : 'Nouvelle formation'}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isUpdateMode && (
              <>
                <div>
                  <label htmlFor="affaire_id" className="block text-sm font-medium text-gray-700">
                    Affaire
                  </label>
                  <select
                    id="affaire_id"
                    {...register('affaire_id', { required: "L'affaire est requise" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner une affaire</option>
                    {affaires.map(affaire => (
                      <option key={affaire.id} value={affaire.id}>
                        {affaire.reference} - {affaire.offre.client.nom}
                      </option>
                    ))}
                  </select>
                  {errors.affaire_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.affaire_id.message}</p>
                  )}
                </div>

                {selectedAffaire && (
                  <div>
                    <label htmlFor="produit_id" className="block text-sm font-medium text-gray-700">
                      Produit de formation
                    </label>
                    {!hasFormationProducts ? (
                      <div className="mt-2 rounded-md bg-yellow-50 p-3">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Cette affaire ne contient aucun produit de type Formation.
                              Veuillez sélectionner une autre affaire ou ajouter un produit de formation à cette affaire.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <select
                        id="produit_id"
                        {...register('produit_id', { required: 'Le produit est requis' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Sélectionner un produit</option>
                        {formationProducts.map(produit => (
                          <option key={produit.id} value={produit.id}>
                            {produit.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.produit_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.produit_id.message}</p>
                    )}
                  </div>
                )}
              </>
            )}

            <div>
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                id="titre"
                {...register('titre', { required: 'Le titre est requis' })}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  errors.titre 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } sm:text-sm`}
              />
              {errors.titre && (
                <p className="mt-1 text-sm text-red-600">{errors.titre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700">
                  Date et heure de début
                </label>
                <input
                  type="datetime-local"
                  id="date_debut"
                  {...register('date_debut', { required: 'La date de début est requise' })}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.date_debut 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } sm:text-sm`}
                />
                {errors.date_debut && (
                  <p className="mt-1 text-sm text-red-600">{errors.date_debut.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700">
                  Date et heure de fin
                </label>
                <input
                  type="datetime-local"
                  id="date_fin"
                  {...register('date_fin', { required: 'La date de fin est requise' })}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.date_fin 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } sm:text-sm`}
                />
                {errors.date_fin && (
                  <p className="mt-1 text-sm text-red-600">{errors.date_fin.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!isUpdateMode && !hasFormationProducts}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdateMode ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}