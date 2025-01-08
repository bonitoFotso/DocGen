import React from 'react';
import { 
  Building2, 
  User2, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText,
  Mail,
  Phone,
  MapPinned,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { DocumentStatus, IOffre, IOffreC } from '../../types';
import ButtonModal from '../../components/ui/buttonModal';
import OfferForm from '../../components/forms/OfferForm';
import { useOffre } from '../../contexts/OffreProvider';
import { useModal } from '../../hooks/useModal';
import { convertOffreToOffreC } from '../../utils/convertOffreToOffreC';

interface OfferDetailsProps {
  offer: IOffre;
  onBack: () => void;
  onEdit: () => void;
}

const OfferDetails: React.FC<OfferDetailsProps> = ({ offer, onBack }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const {updateOffre, fetchOffres} = useOffre();
      const { closeModal } = useModal();
  


  const handleSubmit = (offreData: IOffreC) => {
              // handle form submission
              console.log(offreData);
              updateOffre(offer.id, offreData);
              fetchOffres();
              closeModal();
              onBack();
          };

          const handleStatusChange = (newStatus: DocumentStatus) => {
            if (window.confirm(`Êtes-vous sûr de vouloir changer le statut de l'offre à "${newStatus}" ?`)) {
              updateOffre(offer.id, convertOffreToOffreC({ ...offer, statut: newStatus }));
              fetchOffres();
              onBack();
            }
          };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALIDE':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'REFUSE':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'BROUILLON':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REFUSE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'BROUILLON':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-0 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          
        </button>
        <ButtonModal title="Modifier l'offre">
        <OfferForm initialData={offer} onSubmit={handleSubmit} onCancel={function (): void {
            throw new Error('Function not implemented.');
          } } />
        </ButtonModal>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">{offer.reference}</h1>
              </div>
              <div className={`px-4 py-2 rounded-full border ${getStatusColor(offer.statut)} flex items-center gap-2`}>
                {getStatusIcon(offer.statut)}
                {offer.statut}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              {['VALIDE', 'REFUSE', 'BROUILLON'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as DocumentStatus)}
                  className={`px-4 py-2 rounded border ${getStatusColor(status)} text-sm`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-5 w-5" />
                <span className="font-medium">{offer.entity.name}</span>
                <span className="text-sm text-gray-400">({offer.entity.code})</span>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h2 className="font-medium text-gray-900 mb-3">Dates</h2>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Créé le {formatDate(offer.date_creation)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Dernière modification le {formatDate(offer.date_modification)}</span>
                  </div>
                  {offer.date_validation && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Validé le {formatDate(offer.date_validation)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Produits</h2>
            <div className="grid gap-3">
              {offer.produit.map(product => (
                <div key={product.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.code}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {product.category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations client</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User2 className="h-5 w-5" />
                <span>{offer.client.nom}</span>
              </div>
              {offer.client.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <a href={`mailto:${offer.client.email}`} className="hover:text-blue-500">
                    {offer.client.email}
                  </a>
                </div>
              )}
              {offer.client.telephone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <a href={`tel:${offer.client.telephone}`} className="hover:text-blue-500">
                    {offer.client.telephone}
                  </a>
                </div>
              )}
              {offer.client.adresse && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <span>{offer.client.adresse}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sites */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Sites concernés</h2>
              <MapPinned className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {offer.sites.map(siteId => (
                <div key={siteId.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{siteId.nom}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;