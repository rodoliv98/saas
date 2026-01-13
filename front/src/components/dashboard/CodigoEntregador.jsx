import { useState } from "react";

function CodigoEntregador() {
  const [code, setCode] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await refreshHook('post', 'tenant-delivery-code');
      setCode(res.data.code);
      
    } catch (err) {
      setError('Ocorreu um erro, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Gerar Código para Entregador
          </h2>
          <p className="text-gray-600">
            Gere um código único para seus entregadores acessarem as entregas via Telegram
          </p>
        </div>

        {!code ? (
          <div className="text-center mb-8">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </span>
              ) : (
                'Gerar Código'
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Código do Entregador
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border-2 border-red-700 rounded-lg px-4 py-3">
                  <code className="text-2xl font-bold text-gray-900 tracking-wider">
                    {code}
                  </code>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      Copiado!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                      </svg>
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setCode(null);
                  setError(null);
                }}
                className="text-red-700 font-semibold hover:text-red-800 transition-colors"
              >
                Gerar Novo Código
              </button>
            </div>
          </div>
        )}

        {/* Tutorial sempre disponível */}
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                📱 Como usar o código - Instruções Completas
              </span>
            </div>
            <svg
              className={`w-6 h-6 text-gray-600 transition-transform ${showTutorial ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>

          {showTutorial && (
            <div className="bg-white p-6 border-t-2 border-gray-200">
              <div className="space-y-8">
                {/* Seção: Configuração Inicial */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="bg-red-700 text-white px-3 py-1 rounded-lg text-sm">PASSO 1</span>
                    Configuração Inicial do Entregador
                  </h3>
                  
                  <div className="space-y-5 ml-2">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          📱 Baixar o Telegram
                        </h4>
                        <p className="text-gray-600">
                          O entregador precisa ter o aplicativo Telegram instalado no celular. Está disponível na Play Store (Android) ou App Store (iPhone).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          🔍 Encontrar o Bot
                        </h4>
                        <p className="text-gray-600 mb-3">
                          Abra o Telegram e use a busca (lupa no topo) para procurar:
                        </p>
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3">
                          <code className="text-blue-700 font-bold text-lg">@Minhas_Entregas_bot</code>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          ⚠️ Não esqueça de digitar o <strong>@</strong> na frente!
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          🔑 Enviar o Código
                        </h4>
                        <p className="text-gray-600 mb-3">
                          Após encontrar o bot, o entregador deve enviar o código que você gerou acima. Exemplo:
                        </p>
                        <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 inline-block">
                          <code className="text-gray-900 font-mono text-lg">ACB-DDS-AAS:pizzaria</code>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          4
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          📍 Inserir o PIN da Loja
                        </h4>
                        <p className="text-gray-600 mb-3">
                          Depois de enviar o código, o bot vai pedir o <strong>PIN da loja</strong>. Este PIN você encontra em: <strong>Configurações → PIN da Loja</strong>
                        </p>
                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <div>
                              <p className="font-semibold text-yellow-900 mb-1">Importante!</p>
                              <p className="text-yellow-800 text-sm">
                                O entregador só conseguirá ver os pedidos que estiverem marcados como <strong>"Pronto"</strong> na seção de Pedidos do sistema.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">PASSO 2</span>
                    Como o Entregador Atualiza os Pedidos
                  </h3>
                  
                  <div className="space-y-5 ml-2">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                      <h4 className="font-bold text-blue-900 mb-3 text-lg">
                        📝 Formato do Comando
                      </h4>
                      <p className="text-blue-800 mb-3">
                        Para atualizar um pedido, o entregador deve enviar no Telegram:
                      </p>
                      <div className="bg-white border border-blue-300 rounded-lg p-4 font-mono text-center">
                        <span className="text-red-600 font-bold">CÓDIGO</span>
                        <span className="text-gray-900 font-bold text-xl mx-2">:</span>
                        <span className="text-green-600 font-bold">concluido</span>
                        <span className="text-gray-500 mx-2">ou</span>
                        <span className="text-orange-600 font-bold">cancelado</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Exemplos práticos:</h4>
                      
                      <div className="space-y-4">
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                          <p className="text-sm text-green-700 font-semibold mb-2">✅ Para marcar como entregue:</p>
                          <code className="bg-white px-3 py-2 rounded border border-green-300 inline-block text-green-900 font-mono">
                            awc21d:concluido
                          </code>
                          <p className="text-xs text-green-600 mt-2">
                            (O código awc21d aparece na mensagem que o bot enviou)
                          </p>
                        </div>

                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                          <p className="text-sm text-orange-700 font-semibold mb-2">❌ Para cancelar uma entrega:</p>
                          <code className="bg-white px-3 py-2 rounded border border-orange-300 inline-block text-orange-900 font-mono">
                            awc21d:cancelado
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                          <p className="font-semibold text-purple-900 mb-1">💡 Dica importante:</p>
                          <p className="text-purple-800 text-sm">
                            O código do pedido (exemplo: awc21d) já vem na mensagem que o bot envia. O entregador só precisa copiar esse código, adicionar <strong>dois pontos (:)</strong> e a palavra <strong>concluido</strong> ou <strong>cancelado</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <svg className="w-7 h-7 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <div>
                      <h4 className="font-bold text-green-900 text-lg mb-2">🎉 Tudo Pronto!</h4>
                      <p className="text-green-800">
                        Seguindo esses passos simples, o entregador já estará conectado e poderá receber e atualizar os pedidos diretamente pelo Telegram. Fácil e rápido!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodigoEntregador;