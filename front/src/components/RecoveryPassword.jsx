function RecoveryPassword() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Texto */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Recuperação de Senha
          </h1>
          <p className="text-gray-600 text-base">
            Digite seu e-mail para receber as instruções de recuperação de senha.
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-700 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors mt-2"
          >
            Enviar instruções
          </button>
        </div>

        {/* Link voltar */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Lembrou a senha?{" "}
          <a href="/login" className="text-red-700 font-semibold hover:underline">
            Voltar ao login
          </a>
        </p>

      </div>
    </div>
  );
}

export default RecoveryPassword;