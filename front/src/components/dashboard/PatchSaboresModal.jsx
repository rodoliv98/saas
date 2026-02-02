import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRefreshHook } from "../utils/refresh-hook";

function PatchSaboresModal({ flavorId, setModalOpen }) {
  const { refreshHook } = useRefreshHook();
  const [error, setError] = useState('');

  useEffect(() => {
    if (flavorId) {
      const fetch = async () => {
        try {
          const res = await refreshHook('get', `/tenant-flavors/${flavorId}`);
          setForm(res.data);
  
        } catch (err) {
          console.log(err);
          setError('Ocorreu um erro, reinicie a página ou tente novamente mais tarde.');
        }
      }
      
      fetch();
    }
  }, [])
  
  const [form, setForm] = useState({
    nomeProduto: '',
    descProduto: '',
    precoProduto: 0,
    categoria: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Opções de categoria com ícones
  const categorias = [
    { value: 'borda', label: '🫓 Borda' },
    { value: 'sabores', label: '🍕 Sabores' },
    { value: 'adicional', label: '🧂 Adicional' },
    { value: 'bebida', label: '🥤 Bebida' },
  ];

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    form.precoProduto = Number(form.precoProduto);

    try {
      await refreshHook('patch', `/flavors/${flavorId}`, form);
      setModalOpen(false);
    } catch (err) {
      console.log(err);

      if (err.response.data.code === "VALIDATION_ERROR") {
        return setError(err.response.data.error.map(err => err.message).join(', '));
      }

      setError('Ocorreu um erro, reinicie a página ou tente novamente mais tarde.');
    }

    setForm({
      nomeProduto: '',
      descProduto: '',
      precoProduto: 0,
      categoria: ''
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Adicionar Novo Sabor</h2>
          <button 
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <h2 className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}.</h2>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nomeProduto">
                Nome do sabor *
              </label>
              <input 
                type="text" 
                name="nomeProduto" 
                id="nomeProduto"
                value={form.nomeProduto}
                className="w-full p-2 border rounded"
                placeholder="Ex: Calabresa"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="categoria">
                Categoria *
              </label>
              <select
                className="w-full p-2 border rounded"
                name="categoria"
                id="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categorias.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descProduto">
                Descrição do sabor *
              </label>
              <textarea 
                className="w-full p-2 border rounded"
                placeholder="Ex: Molho de tomate, calabresa, cebola e azeitonas" 
                name="descProduto" 
                id="descProduto" 
                value={form.descProduto}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="precoProduto">
                Preço *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">R$</span>
                </div>
                <input 
                  type="number" 
                  name="precoProduto" 
                  id="precoProduto"
                  value={form.precoProduto}
                  step="0.01"
                  min="0"
                  className="pl-10 w-full p-2 border rounded"
                  placeholder="0,00"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="image">
                Imagem do sabor (opcional)
              </label>
              <input 
                type="file" 
                name="image" 
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {image && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Arquivo selecionado: {image.name}</span>
                </div>
              )}
            </div> */}

            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancelar
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Salvar Sabor
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PatchSaboresModal