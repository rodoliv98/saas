import { useEffect, useState } from 'react'
import { useRefreshHook } from '../utils/refresh-hook'
// ajustar tamanho do div de assinatura
function TelaInicialDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { refreshHook } = useRefreshHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await refreshHook('get', '/api/tenant/home');
        console.log(res);
        setData(res.data);
      } catch (err) {
      } finally {
        setIsLoading(false);
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storeLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
    }
  };

  if (isLoading) {
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
            <div className="text-gray-600">Pedidos Realizados Hoje</div>
            <div className="text-4xl font-bold text-red-700 mb-2">{data?.ordersQuantity}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card do Status da Assinatura */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Status da Assinatura</h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Seu plano termina em:</p>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-700">{daysRemaining} dias</p>
              </div>
            </div>
          </div>

          {/* Card do Link da Loja */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Link da Sua Loja</h3>
            <p className="text-gray-600 mb-4">
              Esse é o link da sua loja. Copie ele e use na sua mensagem automática do seu WhatsApp Business.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 break-all">
              <p className="text-gray-700 text-sm">https://eldur.com.br/{data?.tenantSlug}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {copied ? '✓ Link Copiado!' : 'Copiar Link'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default TelaInicialDashboard;