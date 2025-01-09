/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { useState } from 'react';
import { useOffre } from '@/contexts/OffreProvider';
import { 
  Calendar,
  FileText,
  AlertCircle,
  Building2
} from 'lucide-react';

interface AffaireFormProps {
  onSuccess?: () => void;
  initialData?: any;
}

export function AffaireForm({ onSuccess, initialData }: AffaireFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { offres } = useOffre();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      offre: initialData?.offre?.id || '',
      date_debut: initialData?.date_debut ? format(new Date(initialData.date_debut), "yyyy-MM-dd") : '',
      date_fin_prevue: initialData?.date_fin_prevue ? format(new Date(initialData.date_fin_prevue), "yyyy-MM-dd") : '',
      statut: initialData?.statut || 'EN_COURS'
    }
  });

  const selectedOffreId = watch('offre');
  const selectedOffre = offres.find(o => o.id.toString() === selectedOffreId?.toString());


  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Set time to start of day for date_debut (00:00:00)
      const startDate = new Date(data.date_debut);
      startDate.setHours(0, 0, 0, 0);

      // Set time to end of day for date_fin_prevue (23:59:59)
      let endDate = null;
      if (data.date_fin_prevue) {
        endDate = new Date(data.date_fin_prevue);
        endDate.setHours(23, 59, 59, 999);
      }

      const formData = new FormData();
      formData.append('offre', data.offre);
      if (selectedOffre?.entity?.id) {
        formData.append('entity', selectedOffre.entity.id.toString());
        formData.append('client', selectedOffre.client.id.toString());

      }
      formData.append('date_debut', startDate.toISOString());
      if (endDate) {
        formData.append('date_fin_prevue', endDate.toISOString());
      }
      formData.append('statut', data.statut);
      
      if (initialData) {
        await updateAffaire(initialData.id, formData);
      } else {
        await createAffaire(formData);
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting affaire:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Offre Selection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Informations de l'affaire</h3>
            <p className="text-sm text-gray-500">Sélectionnez l'offre associée et les dates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="offre" className="block text-sm font-medium text-gray-700 mb-1">
              Offre associée
            </label>
            <select
              id="offre"
              {...register('offre', { required: "L'offre est requise" })}
              className={`w-full rounded-lg border ${
                errors.offre 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } shadow-sm p-2.5 text-sm`}
              disabled={isLoading || !!initialData}
            >
              <option value="">Sélectionner une offre</option>
              {offres.map(offre => (
                <option key={offre.id} value={offre.id}>
                  {offre.reference} - {offre.client.nom}
                </option>
              ))}
            </select>
            {errors.offre && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.offre?.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="statut"
              {...register('statut')}
              className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm p-2.5 text-sm"
              disabled={isLoading}
            >
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
              <option value="ANNULEE">Annulée</option>
            </select>
          </div>

          <div>
            <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                id="date_debut"
                {...register('date_debut', { required: 'La date de début est requise' })}
                className={`w-full rounded-lg border ${
                  errors.date_debut 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } shadow-sm pl-10 p-2.5 text-sm`}
                disabled={isLoading}
              />
            </div>
            {errors.date_debut && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.date_debut.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="date_fin_prevue" className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin prévue
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                id="date_fin_prevue"
                {...register('date_fin_prevue')}
                className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm pl-10 p-2.5 text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Offre Preview */}
      {selectedOffre && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Détails de l'offre</h3>
              <p className="text-sm text-gray-500">Informations de l'offre sélectionnée</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Client</p>
              <p className="font-medium text-gray-900">{selectedOffre.client.nom}</p>
            </div>
            <div>
              <p className="text-gray-500">Entité</p>
              <p className="font-medium text-gray-900">{selectedOffre.entity.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Référence</p>
              <p className="font-medium text-gray-900">{selectedOffre.reference}</p>
            </div>
            <div>
              <p className="text-gray-500">Produits</p>
              <p className="font-medium text-gray-900">
                {selectedOffre.produit.map(p => p.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {initialData ? 'Modification en cours...' : 'Création en cours...'}
            </>
          ) : (
            initialData ? 'Modifier l\'affaire' : 'Créer l\'affaire'
          )}
        </button>
      </div>
    </form>
  );
}

async function createAffaire(formData: FormData) {
    const response = await fetch('http://localhost:8008/affaires/', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to create affaire');
    }

    return response.json();
}

async function updateAffaire(id: string, formData: FormData) {
    const response = await fetch(`http://localhost:8008/affaires/${id}`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to update affaire');
    }

    return response.json();
}

export default AffaireForm;