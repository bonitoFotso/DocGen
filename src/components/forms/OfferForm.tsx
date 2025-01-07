/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  IOffreC, DocumentStatus,
  ICategory
} from '../../types';
import { useEntity } from '../../contexts/EntityContext.tsx';
import { useClient } from '../../contexts/ClientContext.tsx';
import { useSite } from '../../contexts/SiteContext.tsx';


import { Info, AlertCircle, Check, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../common/CustomCard.tsx';
import { Alert, AlertDescription } from '../../common/CustomAlert.tsx';
import { useCategory } from '../../hooks/useCategory.tsx';
import { useProduct } from '../../hooks/useProduct.tsx';

interface OfferFormProps {
  initialData?: Partial<IOffreC>;
  onSubmit: (offre: IOffreC) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const OfferForm: React.FC<OfferFormProps> = ({
                                               initialData,
                                               onSubmit,
                                               onCancel,
                                               isEditing = false,
                                             }) => {
  const { entities } = useEntity();
  const { clients } = useClient();
  const { categories } = useCategory();
  const { products } = useProduct();
  const { sites } = useSite();

  const [formData, setFormData] = useState<Partial<IOffreC>>({
    entity: initialData?.entity,
    reference: initialData?.reference || '',
    client: initialData?.client,
    date_creation: initialData?.date_creation || new Date().toISOString(),
    statut: initialData?.statut || DocumentStatus.BROUILLON,
    doc_type: initialData?.doc_type || 'OFF',
    sequence_number: initialData?.sequence_number || 0,
    category: initialData?.category,
    produit: initialData?.produit,
    date_modification: initialData?.date_modification || new Date().toISOString(),
    date_validation: initialData?.date_validation || null,
    sites: initialData?.sites || [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    key: keyof IOffreC,
    collection: any[],
  ) => {
    const selectedItem = collection.find((item) => item.id === Number(e.target.value));
    if (selectedItem) {
      setFormData((prev) => ({ ...prev, [key]: selectedItem.id }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleSiteSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSite = sites.find((site) => site.id === Number(e.target.value));
    if (selectedSite && !formData.sites?.includes(selectedSite.id)) {
      setFormData((prev) => ({
        ...prev,
        sites: [...(prev.sites || []), selectedSite.id],
      }));
    }
  };

  const handleRemoveSite = (siteId: number) => {
    setFormData((prev) => ({
      ...prev,
      sites: prev.sites?.filter((site) => site !== siteId) || [],
    }));
  };

  const validateFormData = (data: Partial<IOffreC>): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!data.entity) newErrors.entity = "L'entité est requise";
    if (!data.client) newErrors.client = "Le client est requis";
    if (!data.category) newErrors.category = "La catégorie est requise";
    if (!data.produit) newErrors.produit = "Le produit est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFormData(formData)) {
      try {
        await onSubmit(formData as IOffreC);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error) {
        console.log('erreur:', error)
        setErrors({ submit: "Une erreur est survenue lors de la soumission" });
      }
    }
  };

  const getSiteName = (siteId: number) => {
    const site = sites.find(s => s.id === siteId);
    return site?.nom || 'Site inconnu';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Modifier l\'offre' : 'Nouvelle offre'}
        </CardTitle>
        
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {showSuccessMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <Check className="w-4 h-4 text-green-500" />
              <AlertDescription className="text-green-700">
                {isEditing ? 'Offre mise à jour avec succès !' : 'Offre créée avec succès !'}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entity Selection */}
            <div className="space-y-2">
              <label htmlFor="entity" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Entité <Info className="w-4 h-4 text-gray-400" />
              </label>
              <select
                id="entity"
                value={formData.entity || ''}
                onChange={(e) => handleSelectChange(e, 'entity', entities)}
                className={`w-full rounded border ${errors.entity ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                          focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors`}
                required
              >
                <option value="">Sélectionnez une entité</option>
                {entities?.map((ent) => (
                  <option key={ent.id} value={ent.id}>{ent.name}</option>
                ))}
              </select>
              {errors.entity && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.entity}
                </p>
              )}
            </div>

            {/* Client Selection */}
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium text-gray-700">
                Client
              </label>
              <select
                id="client"
                value={formData.client || ''}
                onChange={(e) => handleSelectChange(e, 'client', clients)}
                className={`w-full rounded border ${errors.client ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                          focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors`}
                required
              >
                <option value="">Sélectionnez un client</option>
                {clients?.map((cli) => (
                  <option key={cli.id} value={cli.id}>{cli.nom}</option>
                ))}
              </select>
              {errors.client && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.client}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="category"
                value={formData.category || ''}
                onChange={(e) => handleSelectChange(e, 'category', categories)}
                className={`w-full rounded border ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                          focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors`}
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories?.map((cat: ICategory) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Product Selection */}
            <div className="space-y-2">
              <label htmlFor="product" className="text-sm font-medium text-gray-700">
                Produit
              </label>
              <select
                id="product"
                value={formData.produit || ''}
                onChange={(e) => handleSelectChange(e, 'produit', products)}
                className={`w-full rounded border ${errors.produit ? 'border-red-300 bg-red-50' : 'border-gray-300'} 
                          focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors`}
                required
              >
                <option value="">Sélectionnez un produit</option>
                {products?.map((prod) => (
                  <option key={prod.id} value={prod.id}>{prod.name}</option>
                ))}
              </select>
              {errors.produit && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.produit}
                </p>
              )}
            </div>
          </div>

          {/* Sites Section */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <label htmlFor="sites" className="text-sm font-medium text-gray-700">
                Sites associés
              </label>
            </div>

            <select
              id="sites"
              onChange={handleSiteSelection}
              className="w-full rounded border border-gray-300 focus:ring-2 focus:ring-blue-200
                       focus:border-blue-400 transition-colors"
            >
              <option value="">Ajouter un site</option>
              {sites?.map((site) => (
                <option key={site.id} value={site.id}>{site.nom}</option>
              ))}
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {formData.sites?.map((siteId) => (
                <div key={siteId}
                     className="flex items-center justify-between p-2 bg-gray-50 rounded border
                              border-gray-200 hover:border-gray-300 transition-colors">
                  <span className="text-sm text-gray-700">{getSiteName(siteId)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSite(siteId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200
                   transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Annuler
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600
                   transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {isEditing ? 'Mettre à jour' : 'Créer l\'offre'}
        </button>
      </CardFooter>
    </Card>
  );
};

export default OfferForm;