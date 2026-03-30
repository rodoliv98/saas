import { useEffect, useState, useRef } from "react"
import { useRefreshHook } from '../utils/refresh-hook'
import { io } from 'socket.io-client'

function PedidosDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [tenant, setTenant] = useState('');
  const [activeTab, setActiveTab] = useState('ativos');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const previousOrderCount = useRef(0);
  const { refreshHook } = useRefreshHook();

  const activosColumns = [
    { key: 'pendente', title: 'Pendente' },
    { key: 'preparando', title: 'Preparando' },
    { key: 'pronto', title: 'Pronto' },
    { key: 'entregando', title: 'Entregando' }
  ];

  const finalizadosColumns = [
    { key: 'concluido', title: 'Concluído' },
    { key: 'cancelado', title: 'Cancelado' }
  ];

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'preparando', label: 'Preparando' },
    { value: 'pronto', label: 'Pronto' },
    { value: 'entregando', label: 'Entregando' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await refreshHook('get', `/api/orders`);
        setPedidos(res.data.orders);
        setTenant(res.data.tenant);
        previousOrderCount.current = res.data.orders.length;
      } catch (err) {
        setError('Ocorreu um erro ao carregar os pedidos');
      }
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('pedido-criado', async (data) => {
      if (data.tenant === tenant) {
        const res = await refreshHook('get', '/api/orders');
        const newOrderCount = res.data.orders.length;
        
        if (newOrderCount > previousOrderCount.current) {
          playNotificationSound();
        }
        
        previousOrderCount.current = newOrderCount;
        setPedidos(res.data.orders);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [tenant]);

  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Erro ao reproduzir som de notificação:', error);
    }
  };

  const handleUpdateOrder = async (orderId, newStatus) => {
    setError('');

    try {
      await refreshHook('patch', `/api/orders/${orderId}`, { status: newStatus });
      setPedidos(pedidos.map(pedido => 
        pedido.id === orderId ? { ...pedido, status: newStatus } : pedido
      ));
    } catch (err) {
      setError('Erro ao atualizar pedido');
    }
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

  const getTimeElapsed = (createdAt) => {
    if (!createdAt) return '—';
    
    const created = new Date(createdAt);
    const diffMs = currentTime - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}min`;
    }
  };

  const getCardColorByTime = (createdAt, status) => {
    if (status === 'concluido' || status === 'cancelado') {
      return 'border-gray-200 bg-white';
    }

    if (!createdAt) return 'border-gray-200 bg-white';
    
    const created = new Date(createdAt);
    const diffMs = currentTime - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 15) {
      return 'border-gray-200 bg-white';
    } else if (diffMins < 30) {
      return 'border-yellow-400 bg-yellow-50';
    } else {
      return 'border-red-400 bg-red-50';
    }
  };

  const currentColumns = activeTab === 'ativos' ? activosColumns : finalizadosColumns;

  if (error && pedidos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar pedidos</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
          <p className="text-gray-600 text-sm mt-1">
            Acompanhe todos os pedidos em tempo real
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('ativos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'ativos'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pedidos Ativos
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'ativos' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {activosColumns.reduce((sum, col) => sum + getPedidosByStatus(col.key).length, 0)}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('finalizados')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'finalizados'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Finalizados
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'finalizados' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {finalizadosColumns.reduce((sum, col) => sum + getPedidosByStatus(col.key).length, 0)}
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {currentColumns.map(column => {
            const columnPedidos = getPedidosByStatus(column.key);
            
            return (
              <div key={column.key} className="flex-shrink-0 w-80">
                {/* Column Header */}
                <div className="bg-white border border-gray-200 rounded-t-lg p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">{column.title}</h2>
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
                      {columnPedidos.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="bg-gray-100 border border-t-0 border-gray-200 rounded-b-lg p-3 min-h-[calc(100vh-280px)] max-h-[calc(100vh-280px)] overflow-y-auto">
                  <div className="space-y-3">
                    {columnPedidos.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 text-sm">
                        Nenhum pedido
                      </div>
                    ) : (
                      columnPedidos.map(pedido => (
                        <div
                          key={pedido.id}
                          className={`rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow ${getCardColorByTime(pedido.createdAt, pedido.status)}`}
                        >
                          {/* Card Header */}
                          <div className="p-3 border-b border-gray-200">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {pedido.nomeCompleto}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-xs text-gray-500">
                                    #{pedido.id?.slice(-6) || 'N/A'}
                                  </span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500 capitalize">
                                    {pedido.tipoEntrega}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="text-sm font-bold text-gray-900 block">
                                  {formatPrice(pedido.totalOrderPrice)}
                                </span>
                                {pedido.status !== 'concluido' && pedido.status !== 'cancelado' && (
                                  <div className="flex items-center gap-1 mt-1 justify-end">
                                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" />
                                    </svg>
                                    <span className="text-xs text-gray-500 font-medium">
                                      {getTimeElapsed(pedido.createdAt)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Card Body - Todos os detalhes sempre visíveis */}
                          <div className="p-3">
                            {/* Todos os itens do pedido */}
                            <div className="mb-3">
                              <h4 className="font-bold text-gray-900 text-xs mb-2">Itens do Pedido</h4>
                              <div className="space-y-2">
                                {pedido.pedidosItens?.map((item, idx) => (
                                  <div key={idx} className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                                    <div className="flex items-start gap-2">
                                      <span className="font-semibold text-xs text-gray-900 flex-shrink-0">
                                        {item.quantidade}x
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-xs text-gray-900">
                                          {item.nomeProduto}
                                        </p>
                                        {item.descProduto && (
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            {item.descProduto}
                                          </p>
                                        )}
                                        
                                        {/* Itens Adicionais */}
                                        {item.itensAdicionais && item.itensAdicionais.length > 0 && (
                                          <div className="mt-2 pl-2 border-l-2 border-gray-300">
                                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                              Adicionais:
                                            </p>
                                            {item.itensAdicionais.map((adicional, addIdx) => (
                                              <div key={addIdx} className="mb-1">
                                                <p className="text-xs text-gray-700">
                                                  + {adicional.nomeProduto}
                                                </p>
                                                {adicional.descProduto && (
                                                  <p className="text-xs text-gray-500 ml-2">
                                                    {adicional.descProduto}
                                                  </p>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Observação completa */}
                            {pedido.observacao && (
                              <div className="mb-3">
                                <h4 className="font-bold text-gray-900 text-xs mb-2">Observação</h4>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
                                  <p className="text-xs text-gray-700">{pedido.observacao}</p>
                                </div>
                              </div>
                            )}
                            {/* Status Selector */}
                            <select
                              value={pedido.status}
                              onChange={(e) => handleUpdateOrder(pedido.id, e.target.value)}
                              className="w-full text-xs px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent bg-white font-medium"
                            >
                              {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PedidosDashboard;