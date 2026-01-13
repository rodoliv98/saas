import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import api from "../../../intercepter/intercepter";

export function useRefreshHook () {
  const { login, token } = useAuth();
  const redirect = useNavigate();
  
  const refreshHook = async (method, url, data) => {
    try {
      const res = data === undefined 
      ? await api[method](url, { headers: { Authorization: `Bearer ${token}` } })
      : await api[method](url, data, { headers: { Authorization: `Bearer ${token}` } });

      return res;

    } catch (err) {
      if (err.status === 401) {
        try {
          const refreshRes = await api.post('/refresh');
          const newToken = refreshRes.data.token;
          if (newToken) {
            login(newToken);
            
            const retryRes = data === undefined
            ? await api[method](url, { headers: { Authorization: `Bearer ${newToken}` } })
            : await api[method](url, data, { headers: { Authorization: `Bearer ${newToken}` } });
            
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