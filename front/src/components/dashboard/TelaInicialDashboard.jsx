import { useEffect, useState } from 'react'
import { useRefreshHook } from '../utils/refresh-hook'

// Simulando o hook - remova isso e use seu hook real
/* const useRefreshHook = () => ({
  refreshHook: async (method, url) => {
    return {
      tenant: "Pizzaria Bella Vista",
      planType: "Básico",
      ordersQuantity: 28,
      timeRemaining: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      totalValue: 1245.50
    };
  }
}); */

function TelaInicialDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshHook } = useRefreshHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await refreshHook('get', '/tenant/home');
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const calculateDaysRemaining = (date) => {
    const now = new Date();
    const end = new Date(date);
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  const daysRemaining = data?.timeRemaining ? calculateDaysRemaining(data.timeRemaining) : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="mb-16">
          <h2 className="text-5xl font-bold mb-6 leading-tight text-gray-900">
            Bem-vindo, {data?.tenant}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="text-gray-600">Plano Atual</div>
            <div className="text-4xl font-bold text-red-700 mb-2">{data?.planType}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Vendas Hoje</div>
            <div className="text-4xl font-bold text-red-700 mb-2">R$ {data?.totalValue?.toFixed(2).replace('.', ',')}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Pedidos Realizados</div>
            <div className="text-4xl font-bold text-red-700 mb-2">{data?.ordersQuantity}</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Status da Assinatura</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Seu plano termina em:</p>
            <div className="text-right">
              <p className="text-3xl font-bold text-red-700">{daysRemaining} dias</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TelaInicialDashboard;