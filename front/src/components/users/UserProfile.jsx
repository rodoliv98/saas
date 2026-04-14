import { useEffect, useState } from "react";
import { Clock, ChefHat, PackageCheck, Truck, CheckCircle2, XCircle } from "lucide-react";
import { useRefreshHook } from "../utils/refresh-hook";
import { io } from 'socket.io-client';
import { useAuth } from "../auth/AuthProvider";

function UserProfile() {
  const [data, setData] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [errors, setErrors] = useState(null);
  const [activeTab, setActiveTab] = useState('emAndamento');
  const { refreshHook } = useRefreshHook();
  const { token } = useAuth();

  useEffect(() => { 
    const fetch = async () => {
      try {
        const res = await refreshHook('get', '/api/user-data');
        
        setData(res.data.user);
        setPedidos(res.data.pedidos);
        
      } catch (err) {
        setErrors(err.error);
      }
    };

    fetch();
    
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3000', { auth: { token } });
    socket.on('pedido-atualizado', (data) => {
      setPedidos(prev => {
        return prev.map(p => 
          p.id === data.id ? { ...p, status: data.status } : p
        );
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      'pendente': {
        text: 'Aguardando Confirmação',
        color: 'bg-amber-100 text-amber-800',
        icon: Clock,
        step: 1
      },
      'preparando': {
        text: 'Em Preparação',
        color: 'bg-blue-100 text-blue-800',
        icon: ChefHat,
        step: 2
      },
      'pronto': {
        text: 'Pronto para Entrega',
        color: 'bg-indigo-100 text-indigo-800',
        icon: PackageCheck,
        step: 3
      },
      'entregando': {
        text: 'Em Rota de Entrega',
        color: 'bg-purple-100 text-purple-800',
        icon: Truck,
        step: 4
      },
      'concluido': {
        text: 'Pedido Entregue',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle2,
        step: 5
      },
      'cancelado': {
        text: 'Pedido Cancelado',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        step: 0
      }
    };
    return statusMap[status] || statusMap['pendente'];
  };

  const ProgressBar = ({ currentStep }) => {
    const steps = [
      { number: 1, label: 'Aguardando', icon: Clock },
      { number: 2, label: 'Preparando', icon: ChefHat },
      { number: 3, label: 'Pronto', icon: PackageCheck },
      { number: 4, label: 'Entregando', icon: Truck }
    ];

    const filledPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
      <div className="mb-8">
        <div className="relative flex items-center">
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full pointer-events-none"
            style={{
              left: `${100 / (2 * steps.length)}%`,
              width: `${100 * (steps.length - 1) / steps.length}%`
            }}
          >
            <div
              className="h-full bg-red-700 transition-all duration-500 ease-in-out rounded-full"
              style={{ width: `${filledPercent}%` }}
            />
          </div>

          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="flex-1 flex justify-center z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${step.number <= currentStep ? 'bg-red-700 ring-4 ring-red-100' : 'bg-gray-200'}`}
                >
                  <IconComponent 
                    size={24} 
                    className={step.number <= currentStep ? 'text-white' : 'text-gray-400'}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex mt-2">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 text-center">
              <span
                className={`text-xs sm:text-sm font-medium max-w-[80px] break-words
                  ${step.number <= currentStep ? 'text-red-700' : 'text-gray-500'}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const pedidosEmAndamento = pedidos.filter(p => 
    ['pendente', 'preparando', 'pronto', 'entregando'].includes(p.status)
  );

  const pedidosExibidos = activeTab === 'emAndamento' ? pedidosEmAndamento : pedidos;

  if (errors) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-center">
            <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar dados</h2>
            <p className="text-gray-600">{errors}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {data.nomeCompleto?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.nomeCompleto}</h1>
              <p className="text-gray-600">{data.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('emAndamento')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                activeTab === 'emAndamento'
                  ? 'bg-red-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pedidos em Andamento
              {pedidosEmAndamento.length > 0 && (
                <span className="ml-2 bg-white text-red-700 px-2 py-1 rounded-full text-sm">
                  {pedidosEmAndamento.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                activeTab === 'todos'
                  ? 'bg-red-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todos os Pedidos
              {pedidos.length > 0 && (
                <span className="ml-2 bg-white text-red-700 px-2 py-1 rounded-full text-sm">
                  {pedidos.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {pedidosExibidos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <PackageCheck className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600">
              {activeTab === 'emAndamento' 
                ? 'Você não tem pedidos em andamento no momento.'
                : 'Você ainda não fez nenhum pedido.'}
            </p>
          </div>
        ) : activeTab === 'emAndamento' && pedidosExibidos.length > 0 ? (
          (() => {
            const pedido = pedidosExibidos[0];
            const statusInfo = getStatusInfo(pedido.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="w-6 h-6 text-gray-700" />
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {statusInfo.text}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Acompanhe seu pedido em tempo real
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {pedido.status !== 'cancelado' && (
                  <div className="px-6 pt-8 pb-4 bg-white">
                    <ProgressBar currentStep={statusInfo.step} />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <PackageCheck className="w-5 h-5" /> Itens do Pedido
                    </h4>
                    <div className="space-y-3">
                      {pedido.pedidosItens?.map((item, itemIndex) => (
                        <div key={itemIndex} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex gap-4">
                            <img 
                              src={item.imageUrl} 
                              alt={item.nomeProduto}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-semibold text-gray-900">{item.nomeProduto}</h5>
                                  <p className="text-sm text-gray-600">{item.descProduto}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                                  <p className="font-bold text-gray-900">R$ {item.subTotal.toFixed(2)}</p>
                                </div>
                              </div>
                              
                              {item.itensAdicionais && item.itensAdicionais.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <p className="text-xs font-medium text-gray-700 mb-1">Adicionais:</p>
                                  <div className="space-y-1">
                                    {item.itensAdicionais.map((adicional, addIndex) => (
                                      <div key={addIndex} className="flex justify-between text-xs text-gray-600">
                                        <span>+ {adicional.nomeProduto}</span>
                                        <span>R$ {adicional.precoProduto.toFixed(2)}</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Truck className="w-5 h-5" /> Endereço de Entrega
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-700">
                          <span className="font-medium">Rua:</span> {pedido.endereco}, {pedido.numero}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Bairro:</span> {pedido.bairro}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">CEP:</span> {pedido.cep}
                        </p>
                        {pedido.complemento && (
                          <p className="text-gray-700">
                            <span className="font-medium">Complemento:</span> {pedido.complemento}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Detalhes do Pedido
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-gray-700">
                          <span className="font-medium">WhatsApp:</span> {pedido.whatsapp}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Tipo de Entrega:</span> {pedido.tipoEntrega}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Pagamento:</span> {pedido.formaPagamento}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Taxa de Entrega:</span> R$ {pedido.taxaEntrega.toFixed(2)}
                        </p>
                        {pedido.observacao && (
                          <p className="text-gray-700">
                            <span className="font-medium">Observação:</span> {pedido.observacao}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Valor Total
                      </span>
                      <span className="text-2xl font-bold text-red-700">
                        R$ {pedido.totalOrderPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pedidosExibidos.map((pedido, index) => {
              const statusInfo = getStatusInfo(pedido.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-6 h-6 text-gray-700" />
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {statusInfo.text}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Pedido #{index + 1}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <PackageCheck className="w-5 h-5" /> Itens do Pedido
                      </h4>
                      <div className="space-y-3">
                        {pedido.pedidosItens?.map((item, itemIndex) => (
                          <div key={itemIndex} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex gap-4">
                              <img 
                                src={item.imageUrl} 
                                alt={item.nomeProduto}
                                className="w-20 h-20 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' fill='%239ca3af' font-size='24'%3E🍕%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="font-semibold text-gray-900">{item.nomeProduto}</h5>
                                    <p className="text-sm text-gray-600">{item.descProduto}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                                    <p className="font-bold text-gray-900">R$ {item.subTotal.toFixed(2)}</p>
                                  </div>
                                </div>
                                
                                {item.itensAdicionais && item.itensAdicionais.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Adicionais:</p>
                                    <div className="space-y-1">
                                      {item.itensAdicionais.map((adicional, addIndex) => (
                                        <div key={addIndex} className="flex justify-between text-xs text-gray-600">
                                          <span>+ {adicional.nomeProduto}</span>
                                          <span>R$ {adicional.precoProduto.toFixed(2)}</span>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Truck className="w-5 h-5" /> Endereço de Entrega
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <p className="text-gray-700">
                            <span className="font-medium">Rua:</span> {pedido.endereco}, {pedido.numero}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Bairro:</span> {pedido.bairro}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">CEP:</span> {pedido.cep}
                          </p>
                          {pedido.complemento && (
                            <p className="text-gray-700">
                              <span className="font-medium">Complemento:</span> {pedido.complemento}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5" /> Detalhes do Pedido
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <p className="text-gray-700">
                            <span className="font-medium">WhatsApp:</span> {pedido.whatsapp}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Tipo de Entrega:</span> {pedido.tipoEntrega}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Pagamento:</span> {pedido.formaPagamento}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Taxa de Entrega:</span> R$ {pedido.taxaEntrega.toFixed(2)}
                          </p>
                          {pedido.observacao && (
                            <p className="text-gray-700">
                              <span className="font-medium">Observação:</span> {pedido.observacao}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Valor Total
                        </span>
                        <span className="text-2xl font-bold text-red-700">
                          R$ {pedido.totalOrderPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;