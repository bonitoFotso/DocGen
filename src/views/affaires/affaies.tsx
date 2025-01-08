import React, { useEffect, useState } from 'react';
import { useAffaire } from '../../contexts/AffaireProviders';

const Affaires: React.FC = () => {
    const [newAffaire, setNewAffaire] = useState<string>('');

    const { affaires, fetchAffaires } = useAffaire();

    useEffect(() => {
        fetchAffaires();
    }
    , [fetchAffaires]);
    

    

    return (
        <div>
            <h1>Page des Affaires</h1>
            <p>Bienvenue sur la page des affaires.</p>
            <input
                type="text"
                value={newAffaire}
                onChange={(e) => setNewAffaire(e.target.value)}
                placeholder="Ajouter une nouvelle affaire"
            />
            <ul>
                {affaires.map((affaire, index) => (
                    <li key={index}>{affaire.id}</li>
                ))}
            </ul>
        </div>
    );
};

export default Affaires;