// Interface for Entity
export interface IEntity {
  id: number;
  code: string; // Must be 3 uppercase letters (e.g., 'ABC')
  name: string;
}

// Interface for Client
export interface IClient {
  id: number;
  nom: string;
  email?: string | null; // Optional field
  telephone?: string | null; // Optional field
  adresse?: string | null; // Optional field
}

// Interface for Site
export interface ISite {
  id: number;
  nom: string;
  client: IClient; // Associated client
  localisation?: string | null; // Optional field
  description?: string | null; // Optional field
}

// Interface for Site
export interface ISiteC {
  id: number;
  nom: string;
  client: number; // Associated client
  localisation?: string | null; // Optional field
  description?: string | null; // Optional field
}

// Interface for Category
export interface ICategory {
  id: number;
  code: string; // Must be 3 uppercase letters
  name: string;
  entity: IEntity;
}

// Interface for Product
export interface IProduct {
  id: number;
  code: string; // Must match the pattern "VTE\d+" or "EC\d+"
  name: string;
  category: ICategory;
}

// Enum for Document Status
export enum DocumentStatus {
  BROUILLON = 'BROUILLON',
  ENVOYE = 'ENVOYE',
  VALIDE = 'VALIDE',
  REFUSE = 'REFUSE',
}

// Base Interface for Documents
export interface IDocument {
  id: number;
  entity: IEntity;
  reference: string;
  client: IClient;
  date_creation: string; // ISO 8601 formatted string
  statut: DocumentStatus;
  doc_type: string; // e.g., 'PRF', 'FAC'
  sequence_number: number;
}

// Interface for Offre (inherits IDocument)
export interface IOffre extends IDocument {
  category: ICategory;
  produit: IProduct;
  date_modification: string; // ISO 8601 formatted string
  date_validation?: string | null; // Optional field
  sites: ISite[]; // Array of associated sites
}

// Base Interface for Documents
export interface IDocumentC {
id: number;
entity: number;
reference: string;
client: number;
date_creation: string; // ISO 8601 formatted string
statut: DocumentStatus;
doc_type: string; // e.g., 'PRF', 'FAC'
sequence_number: number;
}

// Interface for Offre (inherits IDocument)
export interface IOffreC extends IDocumentC {
category: number;
produit: number;
date_modification: string; // ISO 8601 formatted string
date_validation?: string | null; // Optional field
sites: Array<number>; // Array of associated sites
}

// Interface for Proforma (inherits IDocument)
export interface IProforma extends IDocument {
  offre: IOffre; // Associated Offre
}

// Interface for Facture (inherits IDocument)
export interface IFacture extends IDocument {
  proforma: IProforma; // Associated Proforma
}

// Interface for Rapport (inherits IDocument)
export interface IRapport extends IDocument {
  proforma: IProforma; // Associated Proforma
}

// Interface for Formation
export interface IFormation {
  id: number;
  titre: string;
  client: IClient;
  proforma: IProforma; // Associated Proforma
  date_debut: string; // ISO 8601 formatted string
  date_fin: string; // ISO 8601 formatted string
  description?: string | null; // Optional field
}

// Interface for Participant
export interface IParticipant {
  id: number;
  nom: string;
  prenom: string;
  email?: string | null; // Optional field
  telephone?: string | null; // Optional field
  fonction?: string | null; // Optional field
  formation: IFormation; // Associated Formation
}

// Interface for AttestationFormation (inherits IDocument)
export interface IAttestationFormation extends IDocument {
  proforma: IProforma; // Associated Proforma
  formation: IFormation; // Associated Formation
  participant: IParticipant; // Associated Participant
  details_formation: string;
}
