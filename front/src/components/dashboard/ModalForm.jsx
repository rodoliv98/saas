import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useRefreshHook } from '../utils/refresh-hook';
import { modalConfig } from '../../config/modal-config';

function ModalForm ({ modalOpen, setModalOpen, productId, type }) {
// Estado para o formulário
  const [form, setForm] = useState({
    nomeProduto: '',
    descProduto: '',
    categoria: '',
    precoProduto: 0,
  }); 
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const {
    h2,
    labelName,
    labelDesc,
    labelPrice,
    labelCategory,
    labelImage,
    categorias,
    button,
  } = modalConfig[type] || modalConfig.createProduct;
  const { refreshHook } = useRefreshHook();

  useEffect(() => {
    if (productId && (type === 'editProduct' || type === 'editFlavor')) {
      const fetch = async () => {
        try {
          console.log('test', productId);
          const res = type === 'editProduct' ? await refreshHook('get', `/products/${productId}`)
                                             : await refreshHook('get', `/tenant-flavors/${productId}`);
          // const res = await refreshHook('get', `/products/${productId}`);
          console.log(res.data);
          setForm(res.data);

        } catch (err) {
          console.error(err);
          setError('Ocorreu um erro, reinicie a página ou tente mais tarde.');
        }
      }

      fetch();
    }
  }, []);

  // Manipulador de mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manipulador de mudança de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  
  // Manipulador de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value)
    })
    formData.append('image', image);

    try {
      if (type === 'createProduct') {
        await refreshHook('post', '/products', formData);
      } else if (type === 'editProduct') {
        await refreshHook('patch', `/products/${productId}`, formData);
      } else if (type === 'createFlavor') {
        await refreshHook('post', `/flavors/${productId}`, formData);
      } else if (type === 'editFlavor') {
        await refreshHook('patch', `/flavors/${productId}`, formData)
      }

      setImage(null);
      setModalOpen(false);

    } catch (err) {
      if (err.response.data.code === "VALIDATION_ERROR") {
        return setError(err.response.data.error.map(err => err.message).join(', '));
      }

      setError('Ocorreu um erro, reinicie a página ou tente mais tarde.');
    }
    
    setForm({
      nomeProduto: '',
      descProduto: '',
      categoria: '',
      precoProduto: 0,
    });
  };

  return (
      <div>
        {/* Modal de Adicionar Produto */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">{h2}</h2>
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
                      {labelName} *
                    </label>
                    <input 
                      type="text" 
                      name="nomeProduto" 
                      id="nomeProduto"
                      value={form.nomeProduto}
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Pizza Calabresa 45cm"
                      onChange={handleChange}
                      required
                    />
                  </div>
        
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descProduto">
                      {labelDesc} *
                    </label>
                    <textarea 
                      className="w-full p-2 border rounded"
                      placeholder="Ex: Pizza Calabresa com baccon" 
                      name="descProduto" 
                      id="descProduto" 
                      value={form.descProduto}
                      onChange={handleChange}
                      rows="3"
                      required
                    />
                  </div>
        
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="precoProduto">
                          {labelPrice} *
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
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="categoria">
                        {labelCategory} *
                      </label>
                      <select
                        id="categoria"
                        name="categoria"
                        value={form.categoria}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-white"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => (
                          <option key={categoria.value} value={categoria.value}>
                            {categoria.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
        
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="image">
                      {labelImage} *
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
                      required
                    />
                    {preview && (
                      <div className="mt-3 flex flex-col items-center gap-2">
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                          <img
                            src={preview}
                            alt="Preview do produto"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-sm text-gray-600">Arquivo selecionado: {image?.name}</span>
                      </div>
                    )}
                  </div>
  
                  <div className="pt-4 border-t">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {button}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default ModalForm