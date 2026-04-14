import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useRefreshHook } from "../utils/refresh-hook";

function UserLogin() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const raw = searchParams.get('redirect') || '/';
  const redirectUrl = raw.startsWith('/') && !raw.startsWith('//')
  ? raw
  : '/';
  const { login } = useAuth();
  const { refreshHook } = useRefreshHook();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await refreshHook('post', '/api/login', form);
      login(res.data.token);
      navigate(redirectUrl);
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 w-full max-w-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">{error}</div>}
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
          <label htmlFor="senha" className="block text-sm text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            name="senha"
            id="senha"
            value={form.senha}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-red-200 outline-none"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <div className="mb-4 text-center">
          <Link
            to={`/usuario-cadastro?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-red-700 hover:text-red-800 font-bold text-sm underline"
          >
            Não tem uma conta? Crie agora!
          </Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-700 text-white py-2 rounded font-bold hover:bg-red-800 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default UserLogin;