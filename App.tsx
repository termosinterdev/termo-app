import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Admin } from './pages/Admin';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { PageRoute } from './types';


const getHashRoute = (): string => {
  if (typeof window === 'undefined') return PageRoute.HOME;
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return raw || PageRoute.HOME;
};

const pageTitles: Record<string, string> = {
  [PageRoute.HOME]: 'Termosinter | Metalurgia do Pó',
  [PageRoute.CATALOG]: 'Catálogo Técnico | Termosinter',
  [PageRoute.ABOUT]: 'A Empresa | Termosinter',
  [PageRoute.ADMIN]: 'Admin | Termosinter',
};

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(getHashRoute);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = getHashRoute();
      setCurrentRoute(hash);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Atualizar título da aba conforme rota
  useEffect(() => {
    const cleanRoute = currentRoute.replace(/^#\/?/, '').replace(/^\//, '');
    if (cleanRoute.startsWith('product/')) {
      document.title = 'Detalhe do Produto | Termosinter';
    } else {
      const routeKey = `/${cleanRoute}`;
      document.title = pageTitles[routeKey] || 'Termosinter | Metalurgia do Pó';
    }
  }, [currentRoute]);

  const navigate = (route: string) => {
    const clean = route.replace(/^#\/?/, '');
    window.location.hash = clean;
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    const cleanRoute = currentRoute.replace(/^#\/?/, '').replace(/^\//, '');

    if (cleanRoute.startsWith('product/')) {
      const productIdStr = cleanRoute.split('/')[1];
      if (productIdStr) {
        return <ProductDetail productId={productIdStr} navigate={navigate} />;
      }
    }

    if (cleanRoute === '' || cleanRoute === 'home') {
      return <Home navigate={navigate} />;
    }
    if (cleanRoute === 'catalogo') {
      return <Catalog navigate={navigate} />;
    }
    if (cleanRoute === 'sobre') {
      return <About navigate={navigate} />;
    }
    if (cleanRoute === 'admin') {
      return <Admin />;
    }

    return <Home navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-termo-dark bg-gray-50 selection:bg-termo-yellow selection:text-termo-dark">
      {currentRoute !== PageRoute.ADMIN && <Navbar currentRoute={currentRoute} navigate={navigate} />}
      <main className="flex-grow">
        {renderPage()}
      </main>
      {currentRoute !== PageRoute.ADMIN && <Footer navigate={navigate} />}
    </div>
  );
};

export default App;