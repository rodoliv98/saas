import { Edit, Trash2 } from "lucide-react"
import { useState } from "react";
import { useRefreshHook } from "../utils/refresh-hook";
import ModalForm from "./ModalForm";

function SaborCard ({ flavor, formatPrice, setOpenMostrarSabores }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { refreshHook } = useRefreshHook();

  const handleDeleteFlavor = async (flavorId) => {
    try {
      await refreshHook('delete', `/api/flavors/${flavorId}`);
      setOpenMostrarSabores(false);
    } catch (err) {
    }
  }
  
  return (
    <>
      <div className="flex gap-4">
        
        {/* Imagem do Sabor */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={flavor.imageUrl}
            alt={flavor.nomeProduto}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Informações do Sabor */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {flavor.nomeProduto}
            </h3>
            <span className="text-lg font-bold text-red-600 ml-2 flex-shrink-0">
              {formatPrice(flavor.precoProduto)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {flavor.descProduto}
          </p>
          
          {flavor.categoria && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {flavor.categoria}
            </div>
          )}
        </div>

        {modalOpen && (
          <ModalForm productId={flavor.id} modalOpen={modalOpen} setModalOpen={setModalOpen} type="editFlavor" />
        )}

        {/* Ações */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => setModalOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
            title="Editar sabor"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteFlavor(flavor.id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
            title="Excluir sabor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}

export default SaborCard;