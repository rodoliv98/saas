import { useEffect, useState } from "react"
import { Truck } from "lucide-react";
import { useRefreshHook } from "../utils/refresh-hook";
import { io } from "socket.io-client";

function PedidosComponent() {
  const [pedidos, setPedidos] = useState([]);
  const [tenant, setTenant] = useState('');
  const [showDetails, setShowDetails] = useState({});
  const [activeTab, setActiveTab] = useState('pendente');
  const [error, setError] = useState('');
  const { refreshHook } = useRefreshHook();

  const statusOptions = [
    { value: 'pendente', label: 'Pendente', color: 'bg-orange-100 text-orange-800' },
    { value: 'preparando', label: 'Preparando', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pronto', label: 'Pronto', color: 'bg-blue-100 text-blue-800' },
    { value: 'entregando', label: 'Entregando', color: 'bg-purple-100 text-purple-800' },
    { value: 'concluido', label: 'Concluído', color: 'bg-green-100 text-green-800' },
    { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  const kanbanColumns = [
    { key: 'pendente', title: 'Pendente', color: 'border-orange-200 bg-orange-50', icon: 'clock' },
    { key: 'preparando', title: 'Preparando', color: 'border-yellow-200 bg-yellow-50', icon: 'cooking' },
    { key: 'pronto', title: 'Pronto', color: 'border-blue-200 bg-blue-50', icon: 'check' },
    { key: 'entregando', title: 'Entregando', color: 'border-purple-200 bg-purple-50', icon: 'truck' },
    { key: 'concluido', title: 'Concluído', color: 'border-green-200 bg-green-50', icon: 'success' },
    { key: 'cancelado', title: 'Cancelado', color: 'border-red-200 bg-red-50', icon: 'cancel' }
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await refreshHook('get', `/orders`);
        setPedidos(res.data.orders);
        setTenant(res.data.tenant);
        console.log(res);
      } catch (err) {
        console.log(err);
        setError('Ocorreu um erro, reinicie a página ou tente novamente mais tarde');
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('pedido-criado', async (data) => {
      if (data.tenant === tenant) {
        const res = await refreshHook('get', '/orders');
        setPedidos(res.data.orders);
      }
    });

    // só executa quando desmonta
    return () => {
      socket.disconnect();
    };
  }, [])

  const handleUpdateOrder = async (orderId, newStatus) => {
    setError('');

    try {
      //console.log('novo status', newStatus)
      await refreshHook('patch', `/orders/${orderId}`, { status: newStatus });
      setPedidos(pedidos.map(pedido => 
        pedido.id === orderId ? { ...pedido, status: newStatus } : pedido
      ));
    } catch (err) {
      console.log(err);
      setError('Ocorreu um erro, reinicie a página ou tente novamente mais tarde.');
    }
  }

  const toggleDetails = (pedidoId) => {
    setShowDetails(prev => ({
      ...prev,
      [pedidoId]: !prev[pedidoId]
    }));
  }

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  }

  const getPedidosByStatus = (status) => {
    return pedidos.filter(pedido => pedido.status === status);
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  const getIconForStatus = (iconType) => {
    const icons = {
      clock: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" /></svg>,
      cooking: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C16.28,12.92 16.28,15.18 14.88,16.57C13.49,17.96 11.23,17.96 9.84,16.57L7.69,14.43L10.53,11.59L14.88,11.53M19.07,4.93L17.22,6.78L16.28,5.84L18.13,4L19.07,4.93M15.41,7.68L14.47,6.74L15.73,5.49L16.67,6.43L15.41,7.68M18.13,10.97L19.07,11.91L17.22,13.76L16.28,12.82L18.13,10.97M14.3,10.79L7.83,17.24L4.04,13.46L10.5,7L14.3,10.79Z" /></svg>,
      check: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>,
      truck: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z" /></svg>,
      success: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg>,
      cancel: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg>
    };
    return icons[iconType] || icons.clock;
  };

  const currentColumn = kanbanColumns.find(col => col.key === activeTab);

  if (pedidos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido ainda</h3>
          <p className="text-gray-600">Os pedidos aparecerão aqui quando chegarem</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
            </svg>
          </div>
          {error && (
            <h2 className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</h2>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Pedidos</h1>
          <p className="text-gray-600">Acompanhe e gerencie todos os pedidos em tempo real</p>
        </div>

        {/* Navegação por Abas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {kanbanColumns.map(column => (
                <button
                  key={column.key}
                  onClick={() => setActiveTab(column.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === column.key
                      ? 'border-red-700 text-red-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {getIconForStatus(column.icon)}
                  {column.title}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === column.key 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getPedidosByStatus(column.key).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className={`${currentColumn.color} border-2 rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {getIconForStatus(currentColumn.icon)}
              <h2 className="text-2xl font-bold text-gray-900">{currentColumn.title}</h2>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                {getPedidosByStatus(activeTab).length} {getPedidosByStatus(activeTab).length === 1 ? 'pedido' : 'pedidos'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPedidosByStatus(activeTab).map(pedido => (
              <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                {/* Header do Card */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {pedido.nomeCompleto?.charAt(0)?.toUpperCase() || 'P'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{pedido.nomeCompleto}</h3>
                        <p className="text-sm text-gray-500">Pedido #{pedido.id?.slice(-6) || 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                      {statusOptions.find(opt => opt.value === pedido.status)?.label || pedido.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {pedido.pedidosItens?.length || 0} {pedido.pedidosItens?.length === 1 ? 'item' : 'itens'}
                    </span>
                    <span className="text-lg font-bold text-red-700">
                      {String(pedido.totalOrderPrice.toFixed(2)).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4">
                  {!showDetails[pedido.id] ? (
                    // Visualização: Dados do Cliente
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Endereço de Entrega</h4>
                            <p className="text-sm text-gray-700">{pedido.endereco}</p>
                            <p className="text-sm text-gray-700">{pedido.bairro} - {pedido.cep}</p>
                            {pedido.complemento && (
                              <p className="text-xs text-gray-500 mt-1">{pedido.complemento}</p>
                            )}
                            {pedido.numero && (
                              <p className="text-xs text-gray-500">Número: {pedido.numero}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">WhatsApp</h4>
                            <p className="text-sm text-gray-700">{pedido.whatsapp}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Forma de Pagamento</h4>
                            <p className="text-sm text-gray-700 capitalize">{pedido.formaPagamento}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                              <Truck color="#000000" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Tipo de Entrega</h4>
                            <p className="text-sm text-gray-700 capitalize">{pedido.tipoEntrega}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Visualização: Itens do Pedido
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-900">Itens do Pedido</h4>
                      </div>
                      
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {pedido.pedidosItens?.map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex gap-3">
                              {/* Imagem do Produto */}
                              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                {item.imageUrl ? (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.nomeProduto}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${item.imageUrl ? 'hidden' : 'flex'}`}>
                                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z"/>
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Detalhes do Produto */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{item.nomeProduto}</h5>
                                  <span className="text-sm font-bold text-red-700 ml-2">
                                    {formatPrice(item.precoProduto * item.quantidade)}
                                  </span>
                                </div>
                                
                                {item.descProduto && (
                                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.descProduto}</p>
                                )}
                                
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs text-gray-500">
                                    Qtd: {item.quantidade}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Unit: {formatPrice(item.precoProduto)}
                                  </span>
                                </div>

                                {/* Adicionais */}
                                {item.adicionais?.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Adicionais:</p>
                                    <div className="space-y-1">
                                      {item.adicionais.map((adicional, idx) => (
                                        <div key={idx} className="flex justify-between items-start gap-2">
                                          <div className="flex-1">
                                            <span className="text-xs font-semibold text-gray-900 block">{adicional.nomeProduto}</span>
                                            {adicional.descProduto && (
                                              <span className="text-xs text-gray-500 block mt-0.5">{adicional.descProduto}</span>
                                            )}
                                          </div>
                                          {adicional.precoProduto && (
                                            <span className="text-xs font-bold text-gray-700 whitespace-nowrap ml-2 mt-0.5">{formatPrice(adicional.precoProduto)}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer do Card */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <select 
                      value={pedido.status}
                      onChange={(e) => handleUpdateOrder(pedido.id, e.target.value)}
                      className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent bg-white"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => toggleDetails(pedido.id)}
                      className="px-4 py-1.5 bg-red-700 text-white text-sm rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 font-medium"
                    >
                      {showDetails[pedido.id] ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                          </svg>
                          Ver Cliente
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                          </svg>
                          Ver Produtos
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosComponent;