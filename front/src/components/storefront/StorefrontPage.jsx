import api from '../../../intercepter/intercepter';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductModalStore from './ProductModalStore';
import ProductCardStore from './ProductCardStore';
import ConcluirPedidoModal from './ConcluirPedidoModal';
import { useAuth } from '../auth/AuthProvider';
import { safeUrl } from '../utils/safeUrl';

const TenantStore = () => {
  const { slug } = useParams();
  const { token } = useAuth();
  const redirect = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concluirPedidoModal, setConcluirPedidoModal] = useState(false);
  const [toast, setToast] = useState(null);

  const cartRef = useRef(null);

  const categories = [
    { value: 'pizzas', label: '🍕 Pizzas' },
    { value: 'massas', label: '🍝 Massas' },
    { value: 'hamburgers', label: '🍔 Hamburguers' },
    { value: 'pratos_prontos', label: '🍛 Pratos Prontos' },
    { value: 'bebidas', label: '🥤 Bebidas' },
    { value: 'sobremesas', label: '🍰 Sobremesas' },
    { value: 'porcoes', label: '🍟 Porções' },
    { value: 'lanches', label: '🥪 Lanches' },
    { value: 'sushis', label: '🍣 Sushis' },
    { value: 'saladas', label: '🥗 Saladas' },
    { value: 'sopas', label: '🍜 Sopas' },
    { value: 'vegetariano', label: '🥦 Opções Vegetarianas' }
  ];
  
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        
        const res = await api.get(`/api/cardapio/${slug}`);
        setStoreData(res.data.store);
        setProducts(res.data.products || []);
        
      } catch (err) {
        setError('Ocorreu um erro ao carregar a loja. Verifique o link ou tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchStoreData();
    }
  }, [slug]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Função auxiliar para comparar se dois produtos são idênticos
  const areProductsIdentical = (product1, product2) => {
    // Verifica se são o mesmo produto original
    if (product1.originalId !== product2.originalId) return false;
    
    // Verifica sabores
    const sabores1 = product1.sabores || [];
    const sabores2 = product2.sabores || [];
    
    if (sabores1.length !== sabores2.length) return false;
    
    // Se ambos não têm sabores, são idênticos
    if (sabores1.length === 0) return true;
    
    // Compara cada sabor
    const sabores1Sorted = [...sabores1].sort((a, b) => a.id - b.id);
    const sabores2Sorted = [...sabores2].sort((a, b) => a.id - b.id);
    
    return sabores1Sorted.every((sabor, index) => 
      sabor.id === sabores2Sorted[index].id
    );
  };

  const addToCart = (product) => {
    if (!token) {
      redirect(`/usuario-login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    // Se o produto não tem sabores, adiciona diretamente ou aumenta quantidade
    if (!product.sabores || product.sabores.length === 0 || product.sabores[0].length === 0) {
      const simpleProduct = {
        id: `${product.id}-simple`,
        originalId: product.id,
        nomeProduto: product.nomeProduto,
        descProduto: product.descProduto,
        precoProduto: product.precoProduto,
        categoria: product.categoria,
        imageUrl: product.imageUrl,
        sabores: [],
        quantity: 1,
        totalPrice: product.precoProduto
      };

      setCart(prevCart => {
        // Verifica se já existe um produto idêntico no carrinho
        const existingProductIndex = prevCart.findIndex(item => 
          areProductsIdentical(item, simpleProduct)
        );

        if (existingProductIndex !== -1) {
          // Se já existe, aumenta a quantidade
          const updatedCart = [...prevCart];
          updatedCart[existingProductIndex] = {
            ...updatedCart[existingProductIndex],
            quantity: updatedCart[existingProductIndex].quantity + 1
          };
          return updatedCart;
        } else {
          // Se não existe, adiciona novo
          return [...prevCart, simpleProduct];
        }
      });

      setToast('Item adicionado ao carrinho!');
      setTimeout(() => setToast(null), 2000);
      return;
    }

    // Se tem sabores, abre o modal
    openProductModal(product);
  };

  const addToCartFromModal = (productWithExtras) => {
    setCart(prevCart => {
      // Verifica se já existe um produto idêntico no carrinho
      const existingProductIndex = prevCart.findIndex(item => 
        areProductsIdentical(item, productWithExtras)
      );

      if (existingProductIndex !== -1) {
        // Se já existe, aumenta a quantidade
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Se não existe, adiciona novo
        return [...prevCart, productWithExtras];
      }
    });

    setToast('Item adicionado ao carrinho!');
    setTimeout(() => setToast(null), 2000);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            // Se tem mais de 1, diminui a quantidade
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // Se tem apenas 1, remove completamente (não adiciona ao acc)
        } else {
          // Mantém outros itens
          acc.push(item);
        }
        return acc;
      }, []);
    });
  };

  const removeAllFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getUniqueItemsCount = () => {
    return cart.length;
  };

  // Filtra categorias que têm produtos
  const availableCategories = categories.filter(category =>
    products.some(product => product.categoria === category.value)
  );

  // Agrupa produtos por categoria
  const productsByCategory = availableCategories.reduce((acc, category) => {
    acc[category.value] = products.filter(product => product.categoria === category.value);
    return acc;
  }, {});

  // Filtra produtos baseado na categoria selecionada
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.categoria === selectedCategory);

  // Referência e estados para as setas de scroll
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    updateArrows();
    const handleResize = updateArrows;
    window.addEventListener('resize', handleResize);
    const div = scrollRef.current;
    if (div) {
      div.addEventListener('scroll', updateArrows);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (div) {
        div.removeEventListener('scroll', updateArrows);
      }
    };
  }, [availableCategories]);

  const scrollToLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollToRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollToCart = () => {
    cartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando loja...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16" />
      
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Header da Loja */}
      <section className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

          {/* Wrapper que segura banner + logo sem cortar nada */}
          <div className="relative pb-10">

            {/* Banner */}
            <div className="w-full h-32 sm:h-44 rounded-xl overflow-hidden bg-gradient-to-r from-orange-50 to-red-50">
              {storeData?.bannerUrl && safeUrl(storeData?.bannerUrl) ? (
                <img
                  src={storeData.bannerUrl}
                  alt="Banner da loja"
                  referrerPolicy='no-referrer'
                  crossOrigin='anonymous'
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  className="w-full h-full object-fill"
                />
              ) : (
                <img
                  alt="Banner da loja"
                  className="w-full h-full object-fill"
                />
              )}
            </div>

            {/* Logo — posicionado sobre a borda inferior do banner, fora do overflow-hidden */}
            <div className="absolute bottom-0 left-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex items-center justify-center">
                {storeData?.logoUrl && safeUrl(storeData?.logoUrl) ? (
                  <img
                    src={storeData.logoUrl}
                    alt="Logo da loja"
                    className="w-full object-fill"
                  />
                ) : (
                  <img
                    alt="Logo da loja"
                    className="w-full h-full object-fill"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Infos — sem padding-top excessivo, logo já está fora do fluxo */}
          <div className="pb-6 pt-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {storeData?.nomeEstabelecimento || storeData?.nomeFantasia}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">{storeData?.endereco}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                storeData?.isOpen
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {storeData?.isOpen ? 'Aberto' : 'Fechado'}
              </span>
              {storeData?.tempoPreparo && (
                <span className="text-gray-500 text-xs">
                  🕒 {storeData.tempoPreparo} min
                </span>
              )}
              {storeData?.taxaEntrega && (
                <span className="text-gray-500 text-xs">
                  🚚 R$ {storeData.taxaEntrega}
                </span>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Barra de Filtro Horizontal */}
      {availableCategories.length > 0 && (
        <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative flex items-center">
              {showLeftArrow && (
                <button
                  onClick={scrollToLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ←
                </button>
              )}
              <div
                ref={scrollRef}
                className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 w-full"
              >
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-red-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📋 Todos
                </button>
                {availableCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedCategory === category.value
                        ? 'bg-red-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              {showRightArrow && (
                <button
                  onClick={scrollToRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-900 transition-colors"
                >
                  →
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu de Produtos */}
          <div className="flex-1">
            {selectedCategory === 'all' ? (
              availableCategories.map((category) => (
                <div key={category.value} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {category.label}
                  </h2>
                  <div className="space-y-4">
                    {productsByCategory[category.value].map((product) => (
                      <ProductCardStore 
                        key={product.id} 
                        product={product} 
                        onOpenModal={addToCart}
                        isStoreOpen={storeData?.isOpen}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {categories.find(cat => cat.value === selectedCategory)?.label}
                </h2>
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductCardStore
                      key={product.id} 
                      product={product} 
                      onOpenModal={addToCart}
                      isStoreOpen={storeData?.isOpen}
                    />
                  ))}
                </div>
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">Nenhum produto disponível no momento.</p>
              </div>
            )}
          </div>

          {/* Carrinho Fixo */}
          {cart.length > 0 && (
            <div ref={cartRef} className="lg:w-80">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Seu Pedido
                </h3>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 pr-3">
                        <p className="font-medium text-gray-900">{item.nomeProduto}</p>
                        {item.sabores && item.sabores.length > 0 && (
                          <div className="mt-1">
                            {item.sabores.map((sabor) => (
                              <p key={sabor.id} className="text-xs text-gray-600">
                                + {sabor.nomeProduto} (R$ {Number(sabor.precoProduto).toFixed(2).replace('.', ',')})
                              </p>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          R$ {item.totalPrice.toFixed(2).replace('.', ',')} cada
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200 transition-colors text-xs"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => setCart(prev => prev.map(cartItem => 
                              cartItem.id === item.id 
                                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                : cartItem
                            ))}
                            className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center hover:bg-red-800 transition-colors text-xs"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Preço total do item */}
                        <p className="font-medium text-gray-900 text-sm">
                          R$ {(item.totalPrice * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                        
                        {/* Botão para remover completamente */}
                        <button
                          onClick={() => removeAllFromCart(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors text-xs"
                          title="Remover item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">
                      R$ {getCartTotal().toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'itens'}
                  </p>
                </div>

                <button
                  className="w-full bg-red-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-800 transition-colors disabled:bg-gray-400"
                  disabled={!storeData?.isOpen}
                  onClick={() => setConcluirPedidoModal(true)}
                >
                  {storeData?.isOpen ? 'Finalizar Pedido' : 'Loja Fechada'}
                </button>
              </div>
              {concluirPedidoModal === true && (
                <ConcluirPedidoModal 
                  carrinho={cart} 
                  setConcluirPedidoModal={setConcluirPedidoModal}
                  taxaEntrega={storeData.taxaEntrega} 
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botão flutuante de carrinho para mobile */}
      {cart.length > 0 && (
        <button
          onClick={scrollToCart}
          className="md:hidden fixed bottom-10 right-4 bg-red-700 text-white p-4 rounded-full shadow-lg hover:bg-red-800 transition-colors z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {getUniqueItemsCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs font-bold rounded-full px-2 py-1 border-2 border-white">
              {getUniqueItemsCount()}
            </span>
          )}
        </button>
      )}

      {/* Toast de feedback */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out z-50">
          {toast}
        </div>
      )}

      {/* Modal do Produto */}
      <ProductModalStore
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        onAddToCart={addToCartFromModal}
        isStoreOpen={storeData?.isOpen}
      />
    </div>
  );
};

export default TenantStore;