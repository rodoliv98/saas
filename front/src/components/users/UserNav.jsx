import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import api from "../../../intercepter/intercepter";

function UserNav () {
  const { token } = useAuth();
  const { login } = useAuth();
  const [error, setError] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.post('/refresh');
        login(res.data.token);
      } catch (err) {
        if (!err.response.data.error === 'refreshToken não encontrado') {
          setError('Ocorreu um erro, reinicie a página ou tente mais tarde.');
        }
      }
    }

    if (!token) {
      fetch();
    }
  }, []);

  if (error) {
    return (
      <>
        {error && (
          <h2 className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</h2>
        )}
      </>
    )
  }

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                  <Link to="/" className="text-4xl text-gray-900 tracking-widest" style={{fontFamily: 'Bebas Neue'}}>
                    Eldur
                  </Link>
              </div>
              <nav className="flex space-x-4">
                  {token ? (
                    <Link to="/usuario-perfil" className="bg-red-700 text-white p-2 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </Link>
                  ) : (
                    <Link to={`/usuario-login?redirect=${encodeURIComponent(location.pathname)}`} className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors">
                      Entrar
                    </Link>
                  )}
              </nav>
          </div>
      </div>
    </nav>
  )
}

export default UserNav;