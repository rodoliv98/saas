import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import api from "../../../intercepter/intercepter";

export function useRefreshHook () {
  const { login, token } = useAuth();
  const redirect = useNavigate();

  const refreshHook = async (method, url, data) => {
    
    const makeConfig = (currentToken) => ({
      headers: { Authorization: `Bearer ${currentToken}` }
    });

    try {
      const config = makeConfig(token);

      const res = data === undefined 
      ? await api[method](url, config)
      : await api[method](url, data, config);

      return res;

    } catch (err) {
      if (err.response.data.code === "NOT_AUTHORIZED" || "TOKEN_EXPIRED") {
        try {
          const refreshRes = await api.post('/api/refresh');
          const newToken = refreshRes.data.token;

          if (newToken) {
            login(newToken);

            const newConfig = makeConfig(newToken);

            const retryRes = data === undefined
            ? await api[method](url, newConfig)
            : await api[method](url, data, newConfig);

            if (retryRes.statusText === 'OK') {
              return retryRes;
            }
          
          }
        } catch (secErr) {
          if (secErr.status === 404 || secErr.status === 401 || secErr.response?.status === 401 || secErr.status === 500) {
            redirect('/');
          }
          
          throw secErr;
        }
      }

      throw err;
    }
  };

  return { refreshHook };
}