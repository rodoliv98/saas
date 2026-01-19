import { useState, useEffect } from "react";

function ProductModalStore({ product, isOpen, onClose, onAddToCart, isStoreOpen }) {
  const [sabores, setSabores] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Reset quando o modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setSabores([]);
      setQuantity(1);
      setErrorMessage(null);
      setCurrentStep(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const categoryLimits = {
    'sabores': 2,
    'borda': 1,
    'adicional': 5,
    'bebida': 1,
  };

  const categoryNames = {
    'sabores': 'Sabores',
    'borda': 'Borda',
    'adicional': 'Adicionais',
    'bebida': 'Bebidas',
  };

  const handleSaborToggle = (sabor) => {
    const cat = sabor.categoria || 'Outros';
    const limit = categoryLimits[cat] || Infinity;

    setSabores(prev => {
      const exists = prev.find(s => s.id === sabor.id);
      if (exists) {
        return prev.filter(s => s.id !== sabor.id);
      } else {
        const currentInCat = prev.filter(s => (s.categoria || 'Outros') === cat).length;
        if (currentInCat >= limit) {
          setErrorMessage(`Você pode selecionar no máximo ${limit} itens`);
          setTimeout(() => setErrorMessage(null), 3000);
          return prev;
        }
        return [...prev, sabor];
      }
    });
  };

  const getTotalPrice = () => {
    const basePrice = product.precoProduto;
    const saboresPrice = sabores.reduce((total, sabor) => total + Number(sabor.precoProduto), 0);
    return basePrice + saboresPrice;
  };

  const handleAddToCart = () => {
    const productToAdd = {
      id: `${product.id}-${Date.now()}`,
      originalId: product.id,
      nomeProduto: product.nomeProduto,
      descProduto: product.descProduto,
      precoProduto: product.precoProduto,
      categoria: product.categoria,
      imageUrl: product.imageUrl,
      sabores,
      quantity,
      totalPrice: getTotalPrice()
    };
    
    onAddToCart(productToAdd);
    onClose();
  };

  // Agrupar sabores por categoria
  const allSabores = product.sabores ? product.sabores.flat() : [];
  const groupedSabores = allSabores.reduce((acc, sabor) => {
    const cat = sabor.categoria || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sabor);
    return acc;
  }, {});

  const categoryOrder = ['sabores', 'borda', 'adicional', 'bebida'];
  const displayedCategories = categoryOrder.filter(cat => groupedSabores[cat] && groupedSabores[cat].length > 0);
  const otherCategories = Object.keys(groupedSabores)
    .filter(cat => !categoryOrder.includes(cat) && groupedSabores[cat].length > 0)
    .sort();

  const orderedCategories = [...displayedCategories, ...otherCategories];
  
  // Total de steps: categorias + resumo final
  const totalSteps = orderedCategories.length + 1;
  const isResumoStep = currentStep === orderedCategories.length;
  const currentCategory = orderedCategories[currentStep];

  // Validação: sabores são obrigatórios
  const canProceed = () => {
    if (currentCategory === 'sabores') {
      const selectedInCategory = sabores.filter(s => s.categoria === 'sabores').length;
      return selectedInCategory > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) {
      setErrorMessage('Selecione pelo menos um sabor para continuar');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setErrorMessage(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrorMessage(null);
    }
  };

  const selectedInCurrentCategory = currentCategory 
    ? sabores.filter(s => s.categoria === currentCategory).length 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full h-full sm:max-w-lg sm:h-auto sm:max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col">
        {/* Header fixo */}
        <div className="bg-white border-b border-gray-200 p-4 sm:rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">{product.nomeProduto}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx <= currentStep ? 'bg-red-700' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          {!isResumoStep && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                {categoryNames[currentCategory] || currentCategory}
              </p>
              {currentCategory && categoryLimits[currentCategory] && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedInCurrentCategory}/{categoryLimits[currentCategory]} selecionados
                  {currentCategory === 'sabores' && ' (obrigatório)'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto">
          {!isResumoStep ? (
            <div className="p-4">
              {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-3">
                {groupedSabores[currentCategory]?.map((sabor) => {
                  const isSelected = sabores.find(s => s.id === sabor.id);
                  return (
                    <div
                      key={sabor.id}
                      className={`border rounded-xl p-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSaborToggle(sabor)}
                    >
                      <div className="flex items-start gap-3">
                        {sabor.imageUrl && (
                          <img
                            src={sabor.imageUrl}
                            alt={sabor.nomeProduto}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 text-sm">{sabor.nomeProduto}</h5>
                          {sabor.descProduto && (
                            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{sabor.descProduto}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-red-700 text-sm">
                              + R$ {Number(sabor.precoProduto).toFixed(2).replace('.', ',')}
                            </span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'border-red-500 bg-red-500'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Step de Resumo */
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
              
              {/* Imagem do produto */}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.nomeProduto}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}

              {/* Produto base */}
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <h4 className="font-semibold text-gray-900 mb-2">Produto</h4>
                <div className="flex justify-between text-sm">
                  <span>{product.nomeProduto}</span>
                  <span>R$ {product.precoProduto.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Adicionais selecionados */}
              {orderedCategories.map((categoria) => {
                const selectedInCat = sabores.filter(s => s.categoria === categoria);
                if (selectedInCat.length === 0) return null;
                
                return (
                  <div key={categoria} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {categoryNames[categoria] || categoria}
                    </h4>
                    <div className="space-y-2">
                      {selectedInCat.map((sabor) => (
                        <div key={sabor.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{sabor.nomeProduto}</span>
                          <span className="text-gray-900">+ R$ {Number(sabor.precoProduto).toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Quantidade */}
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Quantidade</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-gray-900 min-w-[30px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-red-700">
                    R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer fixo com botões */}
        <div className="bg-white border-t border-gray-200 p-4 sm:rounded-b-2xl flex-shrink-0">
          {!isResumoStep ? (
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={handleNext}
                className={`py-3 rounded-xl font-semibold transition-colors ${
                  currentStep === 0 ? 'flex-1' : 'flex-1'
                } ${
                  canProceed()
                    ? 'bg-red-700 text-white hover:bg-red-800'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {currentStep === orderedCategories.length - 1 ? 'Ver Resumo' : 'Próximo'}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!isStoreOpen}
                className="flex-[2] bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-800 transition-colors disabled:bg-gray-400"
              >
                {isStoreOpen ? 'Adicionar ao Carrinho' : 'Loja Fechada'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModalStore;