import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { useRefreshHook } from "../utils/refresh-hook";

function UserRegister() {
  const [form, setForm] = useState({ nomeCompleto: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const redirectUrl = searchParams.get('redirect') || '/';
  const navigate = useNavigate();
  const { login } = useAuth();
  const { refreshHook } = useRefreshHook();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await refreshHook('post', '/user-register', form);
      login(res.data.token);
      navigate(redirectUrl);
    } catch (err) {
      if (err.response.data.code === "VALIDATION_ERROR") {
        return setError(err.response.data.error.map(e => e.message).join(', \n'));
      }

      setError('Erro ao cadastrar. Tente novamente.');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 w-full max-w-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Criar Conta</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">{error}</div>}
        <div>
          <label htmlFor="nomeCompleto" className="block text-sm text-gray-700 mb-1">Nome Completo</label>
          <input
            type="text"
            name="nomeCompleto"
            id="nomeCompleto"
            value={form.nomeCompleto}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-red-200 outline-none"
            placeholder="Digite seu nome completo"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-red-200 outline-none"
            placeholder="Digite seu email"
            required
          />
        </div>
        <div>
          <label htmlFor="senha" className="block text-sm text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type={!showPass ? 'password' : 'text'}
              name="senha"
              id="senha"
              value={form.senha}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 pr-10 focus:ring focus:ring-red-200 outline-none"
              placeholder="Digite sua senha"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPass ? <Eye /> : <EyeClosed />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 text-white py-2 rounded font-bold hover:bg-red-800 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}

export default UserRegister;