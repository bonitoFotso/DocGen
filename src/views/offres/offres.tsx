import React, { useState } from 'react';
import OffresTable from './offres_table';
import { Modal } from '../../components/ui/modal';
import OfferForm from '../../components/forms/OfferForm';
import { Plus } from 'lucide-react';
import { useOffre } from '../../contexts/OffreProvider';
import { IOffreC } from '../../types';

const Offres: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingOffre, setEditingOffre] = useState(null);
        const {addOffre, fetchOffres} = useOffre();
    
        const handleSubmit = (offreData: IOffreC) => {
            // handle form submission
            console.log(offreData);
            addOffre(offreData);
            fetchOffres();
            setIsModalOpen(false);
        };
    return (
        <div className="p-1">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Offres</h1>
            {/* Ajoutez ici le contenu de votre page des offres */}
            
            <button 
          onClick={() => {
            setEditingOffre(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Creer une offre
        </button>
            </div>
            
            <OffresTable/>

            <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                      setIsModalOpen(false);
                      setEditingOffre(null);
                    }}
                    title={editingOffre ? 'Edit Offre' : 'Add Offre'}
                  >
                    <OfferForm
                    onSubmit={handleSubmit}
                    initialData={editingOffre || undefined} 
                    onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    } }                    />
                  </Modal>
        </div>
    );
};

export default Offres;