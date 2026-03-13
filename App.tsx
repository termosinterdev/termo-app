import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Admin } from './pages/Admin';
import { ProductDetail } from './pages/ProductDetail';
import { PageRoute } from './types';


const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(PageRoute.HOME);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || PageRoute.HOME;
      setCurrentRoute(hash);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (currentRoute.startsWith('product/')) {
      const productIdStr = currentRoute.split('/')[1];
      const productId = parseInt(productIdStr, 10);
      if (!isNaN(productId)) {
        return <ProductDetail productId={productId} navigate={navigate} />;
      }
    }

    switch (currentRoute) {
      case PageRoute.HOME:
        return <Home navigate={navigate} />;
      case PageRoute.CATALOG:
        return <Catalog navigate={navigate} />;
      case PageRoute.ADMIN:
        return <Admin />;
      default:
        return <Home navigate={navigate} />;
    }
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