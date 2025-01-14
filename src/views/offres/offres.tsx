import React, { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/AppHooks';
import { OffreBase, OffreDetail, OffreEdit, ClientBase, ProductBase, SiteBase, DocumentStatus, EntityBase } from '@/interfaces';
import { PlusCircle, Pencil, Trash2, X, AlertCircle, Loader2, FileText, Building2, Calendar, CheckCircle2, Clock, Send, XCircle } from 'lucide-react';

const getStatusLabel = (status: DocumentStatus): string => {
  const statusLabels: Record<DocumentStatus, string> = {
    'BROUILLON': 'Brouillon',
    'ENVOYE': 'Envoyé',
    'VALIDE': 'Validé',
    'REFUSE': 'Refusé',
    'EN_COURS': 'En cours',
    'TERMINEE': 'Terminée',
    'ANNULEE': 'Annulée'
  };
  return statusLabels[status] || status;
};

const getStatusIcon = (status: DocumentStatus) => {
  switch (status) {
    case 'BROUILLON':
      return <Clock className="h-3 w-3 mr-1" />;
    case 'ENVOYE':
      return <Send className="h-3 w-3 mr-1" />;
    case 'VALIDE':
      return <CheckCircle2 className="h-3 w-3 mr-1" />;
    case 'REFUSE':
      return <XCircle className="h-3 w-3 mr-1" />;
    case 'EN_COURS':
      return <Clock className="h-3 w-3 mr-1" />;
    case 'TERMINEE':
      return <CheckCircle2 className="h-3 w-3 mr-1" />;
    case 'ANNULEE':
      return <X className="h-3 w-3 mr-1" />;
    default:
      return null;
  }
};

const getStatusBadgeClass = (status: DocumentStatus): string => {
  switch (status) {
    case 'BROUILLON':
      return 'bg-gray-100 text-gray-800';
    case 'ENVOYE':
      return 'bg-blue-100 text-blue-800';
    case 'VALIDE':
      return 'bg-green-100 text-green-800';
    case 'REFUSE':
      return 'bg-red-100 text-red-800';
    case 'EN_COURS':
      return 'bg-yellow-100 text-yellow-800';
    case 'TERMINEE':
      return 'bg-emerald-100 text-emerald-800';
    case 'ANNULEE':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OffreManagement = () => {
  const { offreService, clientService, productService, siteService, entityService } = useServices();
  const [offres, setOffres] = useState<OffreBase[]>([]);
  const [clients, setClients] = useState<ClientBase[]>([]);
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [sites, setSites] = useState<SiteBase[]>([]);
  const [entities, setEntities] = useState<EntityBase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffre, setCurrentOffre] = useState<OffreDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState<OffreEdit>({
    client: 0,
    entity: 0,
    produit: [] as number[],
    sites: [] as number[],
    statut: 'BROUILLON'
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [offresData, clientsData, productsData, sitesData, entitiesData] = await Promise.all([
        offreService.getAll(),
        clientService.getAll(),
        productService.getAll(),
        siteService.getAll(),
        entityService.getAll()
      ]);
      setOffres(offresData);
      setClients(clientsData);
      setProducts(productsData);
      setSites(sitesData);
      setEntities(entitiesData);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, [offreService, clientService, productService, siteService, entityService]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentOffre) {
        await offreService.update(currentOffre.id, formData);
      } else {
        await offreService.create(formData);
      }
      setIsModalOpen(false);
      await loadData();
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (offre: OffreBase) => {
    setIsLoading(true);
    try {
      const detailedOffre = await offreService.getById(offre.id);
      setCurrentOffre(detailedOffre);
      setFormData({
        client: detailedOffre.client.id,
        entity: detailedOffre.entity.id,
        produit: detailedOffre.produit.map(p => p.id),
        sites: detailedOffre.sites.map(s => s.id),
        statut: detailedOffre.statut
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement de l\'offre');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await offreService.delete(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  };

  const resetForm = () => {
    setCurrentOffre(null);
    setFormData({
      client: 0,
      entity: 0,
      produit: [],
      sites: [],
      statut: 'BROUILLON'
    });
    setError(null);
  };

  const handleNewOffre = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const filteredOffres = offres.filter(offre => 
    offre.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Offres</h1>
        </div>
        <button
          onClick={handleNewOffre}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-md"
        >
          <PlusCircle className="h-5 w-5" />
          Nouvelle Offre
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-4 animate-fadeIn">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && !offres.length ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                      <span className="ml-2 text-gray-600">Chargement...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOffres.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucune offre trouvée
                  </td>
                </tr>
              ) : (
                filteredOffres.map((offre) => (
                  <tr 
                    key={offre.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{offre.reference}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span>{(offre as OffreDetail).client?.nom || 'Client inconnu'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(offre.date_creation)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(offre.statut)}`}>
                        {getStatusIcon(offre.statut)}
                        {getStatusLabel(offre.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <button
                        onClick={() => handleEdit(offre)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200 inline-flex items-center"
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(offre.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 inline-flex items-center"
                        disabled={isDeleting === offre.id}
                      >
                        {isDeleting === offre.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-2xl transform transition-all duration-200 animate-slideIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {currentOffre ? 'Modifier l\'offre' : 'Nouvelle offre'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: Number(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="">Sélectionnez un client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entité</label>
                    <select
                      value={formData.entity}
                      onChange={(e) => setFormData({ ...formData, entity: Number(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="">Sélectionnez une entité</option>
                      {entities.map(entity => (
                        <option key={entity.id} value={entity.id}>{entity.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as DocumentStatus })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="BROUILLON">Brouillon</option>
                    <option value="ENVOYE">Envoyé</option>
                    <option value="VALIDE">Validé</option>
                    <option value="REFUSE">Refusé</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINEE">Terminée</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produits</label>
                  <select
                    multiple
                    value={formData.produit.map(String)}
                    onChange={(e) => setFormData({
                      ...formData,
                      produit: Array.from(e.target.selectedOptions, option => Number(option.value))
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    size={4}
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs produits</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sites</label>
                  <select
                    multiple
                    value={(formData.sites ?? []).map(String)}
                    onChange={(e) => setFormData({
                      ...formData,
                      sites: Array.from(e.target.selectedOptions, option => Number(option.value))
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    size={4}
                  >
                    {sites.map(site => (
                      <option key={site.id} value={site.id}>{site.nom}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs sites</p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {currentOffre ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffreManagement;