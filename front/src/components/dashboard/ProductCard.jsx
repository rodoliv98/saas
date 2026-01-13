import { Edit, Trash2, Ruler, Clock, Plus, Hamburger } from "lucide-react";
import PatchModal from "./PatchModal";
import { useState } from "react";
import CriarSaboresModal from "./CriarSaboresModal";
import MostrarSabores from "./MostrarSabores";
import { useRefreshHook } from "../utils/refresh-hook";

const ProductCard = ({ product, reloadPage }) => {
  // Mapeamento de categorias para ícones e cores
  const [modalOpen, setModalOpen] = useState(false); 
  const [saborModalOpen, setSaborModalOpen] = useState(false);
  const [openMostrarSabores, setOpenMostrarSabores] = useState(false);
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
  const [error, setError] = useState('');
  const { refreshHook } = useRefreshHook();

  // Formatar preço para moeda brasileira
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Obter o nome formatado da categoria
  const getCategoryName = (category) => {
    const names = {
      pizzas: 'Pizzas',
      massas: 'Massas',
      hamburgers: 'Hambúrgueres',
      pratos_prontos: 'Pratos Prontos',
      bebidas: 'Bebidas',
      sobremesas: 'Sobremesas',
      porcoes: 'Porções',
      lanches: 'Lanches',
      sushis: 'Sushis',
      saladas: 'Saladas',
      sopas: 'Sopas',
      vegetariano: 'Vegetariano',
    };
    return names[category] || category;
  };
  
  const handleDelete = async (productId) => {
    try {
      const res = await refreshHook('delete', `/products/${productId}`);
      //console.log(res);
    } catch (err) {
      console.log(err);
      setError('Ocorreu um erro, reinicie a página ou tente novamente mais tarde.');
    }
  }
  
  const childReloadPage = (data) => {
    reloadPage(data);
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagem do Produto */}
      <div className="h-48 bg-gray-100 relative">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}
          alt={product.nomeProduto}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium flex items-center">
          {categoryIcons[product.categoria] || '📦'} {getCategoryName(product.categoria)}
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.nomeProduto}</h3>
          <span className="text-lg font-bold text-red-600">{formatPrice(product.precoProduto)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.descProduto}</p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Ruler className="w-4 h-4 mr-1" />
            <span>{product.tamanho}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{product.tempoPreparo} min</span>
          </div>
        </div>
      </div>

      {modalOpen && (
        <PatchModal productId={product.id} modalOpen={modalOpen} setModalOpen={setModalOpen} childReloadPage={childReloadPage} />
      )}
      
      {saborModalOpen && (
        <CriarSaboresModal setSaborModalOpen={setSaborModalOpen} productId={product.id} />
      )}

      {openMostrarSabores && (
        <MostrarSabores productId={product.id} setOpenMostrarSabores={setOpenMostrarSabores} />
      )}

      {error && (
        <h2 className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</h2>
      )}

      {/* Ações */}
      <div className="px-4 py-3 bg-gray-50 flex justify-between space-x-2">
        <div className="flex gap-2">
          <button
            onClick={() => setSaborModalOpen(true)}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            title="Adicionar sabor"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setOpenMostrarSabores(true)}
            className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
            title="Visualizar sabores"
          >
            <Hamburger className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setModalOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Editar produto"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(product.id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            title="Excluir produto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard