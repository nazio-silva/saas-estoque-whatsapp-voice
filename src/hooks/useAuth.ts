// frontend-next/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  id: string;
  email: string;
  token: string
}

export function useAuth() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      const userId = localStorage.getItem('user_id');
      const userEmail = localStorage.getItem('user_email');

      if (token && userId && userEmail) {
        setIsAuthenticated(true);
        setUser({ id: userId, email: userEmail, token: token });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []); // Executa apenas uma vez ao montar

  const login = (token: string, userId: string, userEmail: string) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_email', userEmail);
    setLoading(false);
    setIsAuthenticated(true);
    setUser({ id: userId, email: userEmail, token: token });
    router.push('/'); // Redireciona para a página principal
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setLoading(false);
    setUser(null);
    router.push('/login'); // Redireciona para o login
  };

  return { isAuthenticated, user, loading, login, logout };
}