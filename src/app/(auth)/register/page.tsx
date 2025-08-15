// frontend-next/src/app/(auth)/register/page.tsx
'use client'; // Este é um Client Component

import React, { useState } from 'react';
import api from '@/lib/api'; // Usando alias '@' se configurado, ou '../lib/api'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', { email, password });
      
      setMessage(response.data.message || 'Registro realizado com sucesso!');
      setMessageType('success');
      
      // Salva o token JWT no localStorage
      if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token);
        // Opcional: Salvar dados do usuário também
        if (response.data.user) {
          localStorage.setItem('user_email', response.data.user.email);
          localStorage.setItem('user_id', response.data.user.id);
        }
      }

      // Redireciona para a página principal (configurações do cliente) após o registro
      router.push('/');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erro no registro:', error);
      setMessage(error.response?.data?.message || 'Erro ao registrar usuário. Tente novamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center'}}>
      
               <Image 
                  src="/logo.png" 
                  alt="Logo do meu app" 
                  width={200} 
                  height={200} 
                />
      
            </div>

      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '6px',
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '16px' }}
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '16px' }}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '16px' }}
            placeholder="Confirme sua senha"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 20px',
            backgroundColor: '#28a745', // Verde para sucesso/registro
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.3s ease'
          }}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
        Já tem uma conta?{' '}
        <Link href="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
          Faça login
        </Link>
      </p>
    </div>
  );
}