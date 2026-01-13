function ProductCardStore ({ product, onOpenModal, isStoreOpen }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.nomeProduto}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">
              {product.nomeProduto}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {product.descProduto}
            </p>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="font-bold text-gray-900 text-lg mb-2">
            R$ {product.precoProduto.toFixed(2).replace('.', ',')}
          </p>
          <button
            onClick={() => onOpenModal(product)}
            className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors disabled:bg-gray-400"
            disabled={!isStoreOpen}
          >
            {product.sabores && product.sabores.length > 0 && product.sabores[0].length > 0 
              ? 'Personalizar' 
              : 'Adicionar'
            }
          </button>
        </div>
      </div>
    </div>
  );  
} 

export default ProductCardStore;