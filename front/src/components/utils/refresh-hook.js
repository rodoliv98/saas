import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import api from "../../../intercepter/intercepter";

export function useRefreshHook () {
  const { login, token } = useAuth();
  const redirect = useNavigate();

  const makeConfig = (currentToken, idepotencyKey) => ({
    headers: {
      Authorization: `Bearer ${currentToken}`,
      'Idempotency-key': idepotencyKey
    }
  });

  const retryRequest = async (method, url, data, idepotencyKey) => {
    try {
      const refreshRes = await api.post('/api/refresh');
      const newToken = refreshRes.data.token;

      if (newToken) {
        login(newToken);
        const newConfig = makeConfig(newToken, idepotencyKey);

        const retryRes = data === undefined
        ? await api[method](url, newConfig)
        : await api[method](url, data, newConfig);

        return retryRes;
      }
    } catch (secErr) {
      const errStatus = secErr.response?.status;
      if ([404, 401, 500, 403].includes(errStatus)) {
        redirect('/');
      }
      
      throw secErr;
    }
  }

  const refreshHook = async (method, url, data, idepotencyKey) => {
    try {
      const config = makeConfig(token, idepotencyKey);
      const res = data === undefined 
      ? await api[method](url, config)
      : await api[method](url, data, config);

      return res;

    } catch (err) {
      const errorCode = err.response?.data?.code;
      if (["NOT_AUTHORIZED", "TOKEN_EXPIRED", "TOKEN_NOT_FOUND"].includes(errorCode)) {
        return await retryRequest(method, url, data, idepotencyKey);
      }

      throw err;
    }
  };

  return { refreshHook };
}