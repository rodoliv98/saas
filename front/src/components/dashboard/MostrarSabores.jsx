import { useEffect, useState } from "react"
import { X } from "lucide-react"
import SaborCard from "./SaborCard"
import { useRefreshHook } from "../utils/refresh-hook";

function MostrarSabores ({ productId, setOpenMostrarSabores }) {
  const [flavors, setFlavors] = useState([]);
  const [updateFlavor, setUpdateFlavor] = useState(false);
  const [error, setError] = useState('');
  const { refreshHook } = useRefreshHook();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await refreshHook('get', `/flavors/${productId}`);
        setFlavors(res.data);
        
      } catch (err) {
        setError('Ocorreu um erro, reinicie a página ou tente mais tarde.');
      }
    } 

    fetch();
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  if (error) {
    return (
      <>
        {error && (
          <h2 className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}.</h2>
        )}
      </>
    )
  }
  
  return (
    <>
      {/* Overlay do Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          
          {/* Header do Modal */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Sabores Adicionais
            </h2>
            <button
              onClick={() => setOpenMostrarSabores(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo do Modal */}
          <div className="flex-1 overflow-hidden">
            {flavors.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">🍕</div>
                  <h3 className="text-gray-500 font-medium">Nenhum sabor adicional criado</h3>
                  <p className="text-gray-400 text-sm">Adicione sabores para personalizar este produto</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-140px)]">
                {flavors.map((flavor, index) => (
                  <div key={flavor.id || index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <SaborCard 
                      flavor={flavor}
                      formatPrice={formatPrice}
                      updateFlavor={updateFlavor}
                      setUpdateFlavor={setUpdateFlavor}
                      setOpenMostrarSabores={setOpenMostrarSabores}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer (opcional) */}
          {flavors.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{flavors.length} sabor(es) adicionado(s)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MostrarSabores