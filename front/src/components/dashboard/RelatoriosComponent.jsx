import { useState } from 'react';
import { useRefreshHook } from '../utils/refresh-hook';

function RelatoriosComponent () {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(1);
  const [status, setStatus] = useState('concluido'); // novo estado
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const { refreshHook } = useRefreshHook();

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const years = [
    { value: 2026, label: '2026' },
    { value: 2027, label: '2027' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrders([]);
    setTotalVendas(0);
    setTotalPedidos(0);

    try {
      // Monta URL com query params (GET)
      const params = new URLSearchParams({
        year: String(year),
        month: String(month),
        status: String(status)
      });
      const url = `/api/tenant/orders?${params.toString()}`;

      const res = await refreshHook('get', url);
      setOrders(res.data.orders);

      // Calcular totais para relatório básico
      const total = res.data.orders.reduce((acc, order) => {
        const price = parseFloat(order.totalOrderPrice) || 0;
        return acc + price;
      }, 0);
      setTotalVendas(total);
      setTotalPedidos(res.data.orders.length);
    } catch (err) {
      setError('Falha ao carregar o relatório. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Relatório de Vendas</h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Selecione o período para visualizar o relatório de vendas do seu estabelecimento.
          </p>
        </div>

        {/* Barra de filtro */}
        <form
          onSubmit={handleSubmit}
          className="sticky top-6 z-40 bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-md mb-8 max-w-4xl mx-auto
                     flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 w-full">
            <div className="w-full sm:w-1/3">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-900 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
              >
                {years.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/3">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-900 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              {/* select estilizado como botão (dropdown de status) */}
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-900 shadow-sm
                           bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
              >
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
                {/* <option value="todos">Todos</option> */}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 sm:mt-0 w-full sm:w-auto bg-red-700 text-white py-2 px-6 rounded-lg font-semibold
                       hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Carregando...' : 'Gerar Relatório'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center" role="alert">
            {error}
          </div>
        )}

        {orders.length > 0 && (
          <>
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumo Mensal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-1">{totalPedidos}</div>
                  <div className="text-sm text-gray-600">Total de Pedidos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-1">R$ {totalVendas.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Faturamento Total</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={index} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{order.nomeCompleto}</h4>
                      <p className="text-sm text-gray-600">{order.endereco}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">R$ {order.totalOrderPrice}</p>
                      <p className="text-xs text-gray-500">{order.formaPagamento?.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    {order.pedidosItens?.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.nomeProduto}
                          className="w-14 h-14 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.nomeProduto}</h5>
                          <p className="text-xs text-gray-600">Quantidade: {item.quantidade}</p>
                          <p className="text-xs text-gray-600">Subtotal: R$ {item.subTotal}</p>
                          {item.itensAdicionais?.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">Adicionais:</p>
                              <ul className="list-disc list-inside text-xs text-gray-600">
                                {item.itensAdicionais.map((adicional, addIndex) => (
                                  <li key={addIndex}>
                                    {adicional.nomeProduto} - R$ {adicional.precoProduto}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 gap-2">
                    <span>Tipo de Entrega: {order.tipoEntrega?.toUpperCase()}</span>
                    <span>Taxa de Entrega: R$ {order.taxaEntrega}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default RelatoriosComponent;
