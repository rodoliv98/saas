import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import ProductCard from './ProductCard';
import ModalForm from './ModalForm';
import { useRefreshHook } from '../utils/refresh-hook';

function CardapioDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState('');
  const [error, setError] = useState('');
  const { refreshHook } = useRefreshHook();

  // Estados para o filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Categorias com ícones
  const categoryIcons = {
    pizzas: '🍕',
    massas: '🍝',
    hamburgers: '🍔',
    pratos_prontos: '🍛',
    bebidas: '🥤',
    sobremesas: '🍰',
    porcoes: '🍟',
    lanches: '🥪',
    sushis: '🍣',
    saladas: '🥗',
    sopas: '🍜',
    vegetariano: '🥦',
  };

  const reloadPage = (data) => {
    setReload(data);
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await refreshHook('get', '/products');
        setProducts(res.data);

      } catch (err) {
        setError('Ocorreu um erro, reinicie a página ou tente mais tarde.');
      }
    }

    fetch();
  }, [reload]);

  // Efeito para aplicar os filtros sempre que products, searchTerm ou selectedCategory mudarem
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products]; // Criar uma cópia do array

    // Filtro por termo de busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => {
        const searchLower = searchTerm.toLowerCase().trim();
        return (
          (product.nomeProduto && product.nomeProduto.toLowerCase().includes(searchLower)) ||
          (product.descProduto && product.descProduto.toLowerCase().includes(searchLower))
        );
      });
    }

    // Filtro por categoria
    if (selectedCategory.trim()) {
      filtered = filtered.filter(product => 
        product.categoria === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  if (error) {
    return (
      <div className='p-6'>
        {error && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{error}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Produto
        </button>
      </div>

      {isModalOpen == true && <ModalForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}

      {/* Filtros funcionais */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg bg-white min-w-[200px]"
          >
            <option value="">Todas as categorias</option>
            {Object.entries(categoryIcons).map(([key, icon]) => (
              <option key={key} value={key}>
                {icon} {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        {/* Contador de resultados */}
        <div className="mt-2 text-sm text-gray-600">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
              reloadPage={reloadPage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {products.length === 0 ? (
            <>
              <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
              <button className="mt-4 text-red-600 hover:text-red-700 font-medium">
                Adicionar primeiro produto
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500">Nenhum produto encontrado com os filtros aplicados.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Limpar filtros
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CardapioDashboard;