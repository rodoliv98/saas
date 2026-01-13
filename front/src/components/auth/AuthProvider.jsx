import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider ({ children }) {
  const [token, setToken] = useState();

  const login = (accessToken) => {
    setToken(accessToken);
  }

  const logout = () => {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }} >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Erro');

  return context;
}

export default AuthProvider;