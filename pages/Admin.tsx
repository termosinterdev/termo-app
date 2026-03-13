import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Edit, Trash2, Plus, Box, LayoutDashboard, Settings } from 'lucide-react';

export const Admin: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 pt-20">
      <aside className="w-64 bg-termo-dark text-gray-400 hidden lg:flex flex-col">
        <div className="p-6">
          <span className="text-xs uppercase font-bold tracking-widest text-termo-yellow">Strapi Admin</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded cursor-pointer">
            <Box size={18} />
            <span className="font-medium">Content Manager</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-gray-800 rounded cursor-pointer transition-colors">
            <LayoutDashboard size={18} />
            <span className="font-medium">Media Library</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-gray-800 rounded cursor-pointer transition-colors">
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </div>
        </nav>
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-termo-yellow"></div>
            <div>
              <p className="text-white text-sm font-bold">Admin User</p>
              <p className="text-xs">admin@termosinter.com</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-800">Produtos</h1>
              <p className="text-gray-500">Gerenciamento do catálogo ({MOCK_PRODUCTS.length} entradas)</p>
            </div>
            <button className="flex items-center gap-2 bg-termo-dark text-white px-5 py-2.5 rounded font-bold hover:bg-gray-800 transition-colors">
              <Plus size={18} />
              Criar nova entrada
            </button>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Imagem</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">#{product.id}</td>
                    <td className="px-6 py-4">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.material}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.price}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
              <span>Mostrando {MOCK_PRODUCTS.length} de {MOCK_PRODUCTS.length} resultados</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled>Anterior</button>
                <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Próximo</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};