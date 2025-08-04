// frontend-next/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});


// Adiciona um interceptor de requisição que insere o token JWT
api.interceptors.request.use(
    (config) => {
      // Verifica se estamos no ambiente do navegador (Client Component)
      // 'window' só existe no lado do cliente
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          // Adiciona o token ao cabeçalho 'x-auth-token' para todas as requisições
          config.headers['x-auth-token'] = token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Opcional: Adicionar um interceptor de resposta para lidar com tokens expirados/inválidos
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Se o token for inválido ou expirado, limpa o token e redireciona para o login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_id');
          // Você precisaria de um hook ou contexto de autenticação para redirecionar de forma robusta
          // Ex: window.location.href = '/login'; // Força o redirecionamento
        }
      }
      return Promise.reject(error);
    }
  );

export default api;