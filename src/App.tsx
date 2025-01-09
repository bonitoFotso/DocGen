import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { Dashboard } from './views/dashboard';
import { Entities } from './views/entities/entities';
import { Sites } from './views/sites';
import { Products } from './views/products';
import { Documents } from './views/documents';
import { Rapports } from './views/rapports/rapports';
import Affaires from './views/affaires/affaies';
import { Proformas } from './views/proformas/Proformas';
import { Offres } from './views/offres/offres';
import { Clients } from './views/clients/clients';
import { Formations } from './views/formations/formations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="entities" element={<Entities />} />
          <Route path="clients" element={<Clients />} />
          <Route path="sites" element={<Sites />} />
          <Route path="products" element={<Products />} />
          <Route path="documents" element={<Documents />} />
          <Route path="formations" element={<Formations />} />
          <Route path="offres" element={<Offres/>} />
          <Route path="affaires" element={<Affaires/>} />
          <Route path="proformas" element={<Proformas/>} />
          <Route path="rapports" element={<Rapports/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;