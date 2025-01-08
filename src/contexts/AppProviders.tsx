import  { ReactNode } from 'react';
import { ProformaProvider } from './ProformaProvider';
import { OffreProvider } from './OffreProvider';
import { FactureProvider } from './FactureProvider';
import { RapportProvider } from './RapportProvider';
import { AttestationFormationProvider } from './AttestationFormationProvider';
import { ProductProvider } from './ProductProvider';
import { EntityProvider } from './EntityContext.tsx';
import { CategoryProvider } from './CategoryContext.tsx';
import { ClientProvider } from './ClientContext.tsx';
import { SiteProvider } from './SiteContext.tsx';
import { FormationProvider } from './FormationProvider.tsx';
import { ParticipantProvider } from './ParticipantProvider.tsx';
import { ModalProvider } from './ModalProvider.tsx';
import { AffaireProvider } from './AffaireProviders.tsx';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    

    <ClientProvider>
      <EntityProvider>
      <SiteProvider>
    <ProformaProvider>
      <OffreProvider>
        <AffaireProvider>

        
        <FactureProvider>
          <RapportProvider>

              <AttestationFormationProvider>
                <CategoryProvider>
                  <ProductProvider>
                    <FormationProvider>
                      <ParticipantProvider>
                      <ModalProvider>
                        {children}
                        </ModalProvider>
                      </ParticipantProvider>
                    </FormationProvider>
                  </ProductProvider>
                </CategoryProvider>
              </AttestationFormationProvider>

          </RapportProvider>
        </FactureProvider>
        </AffaireProvider>
      </OffreProvider>
    </ProformaProvider>
      </SiteProvider>
      </EntityProvider>
    </ClientProvider>
    
  );
}
