import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRefreshHook } from "../utils/refresh-hook";

function ConcluirPedidoModal ({ carrinho, setConcluirPedidoModal, taxaEntrega }) {
  const { slug } = useParams(); 
  const [entrega, setEntrega] = useState();
  const [form, setForm] = useState({
    nomeCompleto: '',
    endereco: '',
    bairro: '',
    cep: '',
    numero: '',
    complemento: '',
    whatsapp: '',
    formaPagamento: '',
    tipoEntrega: '',
    observacao: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshHook } = useRefreshHook();
  const redirect = useNavigate();

  const sanitizeInput = (value) => {
    return value.replace(/[<>\[\]{}]/g, '');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = sanitizeInput(value);

    if (name === 'tipoEntrega') {
      setEntrega(sanitizedValue);
    }

    if (name === 'whatsapp') {
      // Remove tudo que não for número
      let onlyNumbers = sanitizedValue.replace(/\D/g, '');
      if (onlyNumbers.length > 11) onlyNumbers = onlyNumbers.slice(0, 11);
      if (onlyNumbers.length === 11) {
        // (00) 00000-0000
        sanitizedValue = onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (onlyNumbers.length === 10) {
        // (00) 0000-0000
        sanitizedValue = onlyNumbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        // Parcial
        sanitizedValue = onlyNumbers;
      }
    }

    if (name === 'cep') {
      // Remove tudo que não for número
      let onlyNumbers = sanitizedValue.replace(/\D/g, '');
      if (onlyNumbers.length > 8) onlyNumbers = onlyNumbers.slice(0, 8);
      if (onlyNumbers.length === 8) {
        // 00.000-000
        sanitizedValue = onlyNumbers.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
      } else if (onlyNumbers.length > 2 && onlyNumbers.length <= 5) {
        // 00.000
        sanitizedValue = onlyNumbers.replace(/(\d{2})(\d{0,3})/, '$1.$2');
      } else if (onlyNumbers.length > 5 && onlyNumbers.length < 8) {
        // 00.000-0xx
        sanitizedValue = onlyNumbers.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2-$3');
      } else {
        sanitizedValue = onlyNumbers;
      }
    }

    setForm(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  }

  // Calcula o total dos itens do carrinho (sem taxa de entrega)
  const getTotalItems = (carrinho) => {
    return carrinho.reduce((acc, item) => {
      return acc + (item.totalPrice * item.quantity);
    }, 0);
  }

  const totalItens = getTotalItems(carrinho);
  const totalComEntrega = totalItens + taxaEntrega;

  const handleSubmit = async () => {
    form.tenantSlug = slug;
    form.items = carrinho.map(carr => ({
      id: carr.originalId,
      nomeProduto: carr.nomeProduto,
      descProduto: carr.descProduto,
      precoProduto: carr.precoProduto,
      categoria: carr.categoria,
      quantidade: carr.quantity,
      adicionais: carr.sabores ? 
        carr.sabores.map(sabor => ({
          id: sabor.id,
          nomeProduto: sabor.nomeProduto,
          descProduto: sabor.descProduto,
          categoria: sabor.categoria,
          precoProduto: sabor.precoProduto,
        })) 
        :
        [],
      totalPrice: Number(carr.totalPrice.toFixed(2)),
      imageUrl: carr.imageUrl
    }));
    
    // Define valores baseado no tipo de entrega
    if (form.tipoEntrega === 'retirada') {
      form.totalOrderPrice = Number(totalItens.toFixed(2));
      form.taxaEntrega = 0;
    } else {
      form.totalOrderPrice = Number(totalComEntrega.toFixed(2));
      form.taxaEntrega = taxaEntrega;
    }

    setIsLoading(true);

    try {
      await refreshHook('post', '/api/orders', form);
      redirect('/usuario-perfil');
      setConcluirPedidoModal(false);

    } catch (err) {
      if (err.response.data.code === "VALIDATION_ERROR") {
        return setError(err.response.data.error.map(e => e.message).join(', '));
      }
      setError(err.response.data.error);
    } finally {
      setIsLoading(false);
    }

    setForm({
      nomeCompleto: '',
      endereco: '',
      bairro: '',
      cep: '',
      numero: '',
      complemento: '',
      whatsapp: '',
      formaPagamento: '',
      tipoEntrega: '',
      observacao: ''
    });
  }

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-200">
        {/* Header do Modal */}
        <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Finalizar Pedido</h2>
          <button 
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            onClick={() => setConcluirPedidoModal(false)} 
          >
            <span className="text-gray-600 text-xl">×</span>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={e => { e.preventDefault(); handleSubmit() }} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                📝 Informações Pessoais
              </h3>
              
              <div>
                <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  id="nomeCompleto"
                  name="nomeCompleto" 
                  type="text"
                  value={form.nomeCompleto} 
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input 
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  value={form.whatsapp}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                📍 Endereço de Entrega
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input 
                    id="endereco"
                    name="endereco"
                    type="text" 
                    value={form.endereco}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                    placeholder="Rua, Avenida..."
                  />
                </div>

                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
                    Número
                  </label>
                  <input 
                    id="numero"
                    name="numero"
                    type="text"
                    value={form.numero}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <input 
                    id="bairro"
                    name="bairro"
                    type="text" 
                    value={form.bairro}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                    placeholder="Nome do bairro"
                  />
                </div>

                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input
                    id="cep"
                    name="cep" 
                    type="text"
                    value={form.cep} 
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento (opcional)
                </label>
                <input 
                  id="complemento"
                  name="complemento"
                  type="text"
                  value={form.complemento}
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                  placeholder="Apto, Bloco, Casa..."
                />
              </div>
            </div>

            {/* Detalhes do Pedido */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                🛵 Detalhes do Pedido
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="formaPagamento" className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de Pagamento
                  </label>
                  <select
                    id="formaPagamento"
                    name="formaPagamento"
                    value={form.formaPagamento}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors bg-white"
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="cartao">Cartão</option>
                    <option value="pix">Pix</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tipoEntrega" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Entrega
                  </label>
                  <select
                    id="tipoEntrega"
                    name="tipoEntrega"
                    value={form.tipoEntrega}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors bg-white"
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="delivery">Delivery</option>
                    <option value="retirada">Retirada</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea 
                  id="observacao" 
                  name="observacao" 
                  value={form.observacao}
                  onChange={handleChange}
                  placeholder="Se quiser remover algo digite aqui..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors resize-none"
                />
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                🛒 Resumo do Pedido
              </h3>
              {/* Valor total da compra */}
              <div className="flex flex-col items-end mb-2 gap-1">
                {entrega === 'delivery' ? (
                  <div className="text-right">
                    <div className="text-base text-gray-700">Total dos itens:</div>
                    <div className="text-lg font-bold text-gray-900">R$ {totalItens.toFixed(2).replace('.', ',')}</div>
                    <div className="text-base text-gray-700 mt-1">Taxa de entrega:</div>
                    <div className="text-lg font-bold text-gray-900">R$ {taxaEntrega.toFixed(2).replace('.', ',')}</div>
                    <div className="text-base text-gray-700 mt-2">Total do pedido:</div>
                    <div className="text-xl font-extrabold text-red-700">R$ {totalComEntrega.toFixed(2).replace('.', ',')}</div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-base text-gray-700">Total do pedido:</div>
                    <div className="text-xl font-extrabold text-red-700">R$ {totalItens.toFixed(2).replace('.', ',')}</div>
                  </div>
                )}
              </div>
              {carrinho.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-center">⚠️ Nenhum produto adicionado no carrinho</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {carrinho.map((carr, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          {carr.imageUrl && (
                            <img
                              src={carr.imageUrl}
                              alt={carr.nomeProduto}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <h4 className="font-semibold text-gray-900">{carr.nomeProduto}</h4>
                        </div>
                        <span className="text-red-700 font-bold">
                          R$ {Number(carr.precoProduto).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{carr.descProduto}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Quantidade: {carr.quantity}</span>
                      </div>
                      {carr.sabores && carr.sabores.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Adicionais:</p>
                          {carr.sabores.map((sabor, saborIndex) => (
                            <div key={saborIndex} className="bg-white rounded p-2 mb-2 border border-gray-100">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{sabor.nomeProduto}</p>
                                  <p className="text-gray-600 text-xs">{sabor.descProduto}</p>
                                </div>
                                <span className="text-red-700 font-medium text-sm">
                                  +R$ {Number(sabor.precoProduto).toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <h2 className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}.</h2>
            )}
            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setConcluirPedidoModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-800 transition-colors disabled:bg-gray-400"
              >
                🚀 Finalizar Pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConcluirPedidoModal;