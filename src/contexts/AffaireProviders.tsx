import type { ReactNode } from 'react';
import { useMemo, useState, useContext, useCallback, createContext, useEffect } from 'react';
import { AffaireService } from '../services/affaire.service';
import { IAffaire, IAffaireC } from '../types';

interface AffaireContextType {
    affaires: IAffaire[];
    loading: boolean;
    error: string | null;
    selectedAffaire: IAffaire | null;
    fetchAffaires: () => Promise<void>;
    fetchAffaireById: (id: number) => Promise<void>;
    createAffaire: (affaire: IAffaireC) => Promise<void>;
    updateAffaire: (id: number, affaire: Partial<IAffaireC>) => Promise<void>;
    deleteAffaire: (id: number) => Promise<void>;
    setSelectedAffaire: (affaire: IAffaire | null) => void;
}

const AffaireContext = createContext<AffaireContextType | undefined>(undefined);

export function AffaireProvider({ children }: { children: ReactNode }) {
    const [affaires, setAffaires] = useState<IAffaire[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAffaire, setSelectedAffaire] = useState<IAffaire | null>(null);

    const fetchAffaires = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await AffaireService.getAll();
            setAffaires(data);
        } catch (err) {
            setError('Erreur lors du chargement des affaires');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAffaires();
    }, [fetchAffaires]);

    const fetchAffaireById = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await AffaireService.getById(id);
            setSelectedAffaire(data);
        } catch (err) {
            setError('Erreur lors du chargement de l\'affaire');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createAffaire = useCallback(async (affaire: IAffaireC) => {
        try {
            setLoading(true);
            setError(null);
            const newAffaire = await AffaireService.create(affaire);
            setAffaires((prev) => [...prev, newAffaire]);
        } catch (err) {
            setError('Erreur lors de la création de l\'affaire');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAffaire = useCallback(async (id: number, affaire: Partial<IAffaireC>) => {
        try {
            setLoading(true);
            setError(null);
            const updatedAffaire = await AffaireService.update(id, affaire);
            setAffaires((prev) => prev.map((a) => (a.id === id ? updatedAffaire : a)));
        } catch (err) {
            setError('Erreur lors de la mise à jour de l\'affaire');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteAffaire = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await AffaireService.delete(id);
            setAffaires((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            setError('Erreur lors de la suppression de l\'affaire');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo(
        () => ({
            affaires,
            loading,
            error,
            selectedAffaire,
            fetchAffaires,
            fetchAffaireById,
            createAffaire,
            updateAffaire,
            deleteAffaire,
            setSelectedAffaire,
        }),
        [
            affaires,
            loading,
            error,
            selectedAffaire,
            fetchAffaires,
            fetchAffaireById,
            createAffaire,
            updateAffaire,
            deleteAffaire,
        ]
    );

    return <AffaireContext.Provider value={value}>{children}</AffaireContext.Provider>;
}

export function useAffaire() {
    const context = useContext(AffaireContext);
    if (context === undefined) {
        throw new Error('useAffaire doit être utilisé à l\'intérieur d\'un AffaireProvider');
    }
    return context;
}