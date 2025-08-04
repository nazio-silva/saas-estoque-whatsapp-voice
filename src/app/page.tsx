// frontend-next/src/app/page.tsx
'use client'; // Client Component para usar o hook
import CenteredButton from '@/components/CenteredButton';
import ClientForm from '@/components/ClientForm';
import QrCodeModal from '@/components/QrCodeModal';
import WhatsAppConnectButton from '@/components/WhatsAppConnectButton';
import { useAuth } from '@/hooks/useAuth'; // Importe o hook de autenticação
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function HomePage() {
  const { isAuthenticated, loading, user, logout } = useAuth(); // Assume 'loading' do hook para indicar que a verificação ainda está em andamento
  const router = useRouter(); // Importe useRouter


  // --- Adicione/Verifique estas declarações de estado ---
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [currentPairingCode, setCurrentPairingCode] = useState<string | null>(null);
  const [qrErrorMessage, setQrErrorMessage] = useState('');


  const [currentUserId, setCurrentUserId] = useState<string | null>('SEU_ID_DE_USUARIO_LOGADO'); // Mude para o ID real do usuário
  const [currentUserToken, setCurrentUserToken] = useState<string | null>('SEU_TOKEN_JWT_AQUI'); // Mude para o token real do usuário


  // Função para buscar o QR Code do backend
  const fetchQrCode = useCallback(async () => {
    if (!isAuthenticated) return;
    setQrLoading(true);
    setQrErrorMessage('');
    try {
      const response = await api.get('/bot/qr');
      console.log('fetchQrCode qrCode: ', response.data.qrCode)

      const { qrCode, pairingCode, message } = response.data;

      if (pairingCode) {
        setCurrentQrCode(pairingCode);
        setCurrentPairingCode(pairingCode);
        setCurrentQrCode(null);
        setIsQrModalOpen(true);
      } else if (qrCode) {
        setCurrentQrCode(qrCode);
        setCurrentPairingCode(null);
        setIsQrModalOpen(true); // Abre o modal se há um QR code
      } else {
        setCurrentQrCode(null);
        setCurrentPairingCode(null);
        setIsQrModalOpen(false); // <--- FECHA O MODAL AQUI
        setQrErrorMessage(message || 'Bot conectado ou sem código disponível.');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erro ao buscar código/QR:', error);
      setQrErrorMessage('Erro ao carregar o código. Tente novamente mais tarde.');
      setCurrentQrCode(null);
      setCurrentPairingCode(null);
      setIsQrModalOpen(false);
    } finally {
      setQrLoading(false);
    }
  }, [isAuthenticated]);


  // --- NOVO: Lógica de Polling ---
  /*  useEffect(() => {
     let interval: NodeJS.Timeout | null = null;
     // Inicia o polling apenas se o modal estiver aberto
     if (isQrModalOpen) {
       interval = setInterval(() => {
         fetchQrCode(); // Chama a função para verificar o status do QR/Link
       }, 50000); // A cada 5 segundos
     }
 
     // Limpa o intervalo quando o componente desmonta ou o modal fecha
     return () => {
       if (interval) {
         clearInterval(interval);
       }
     };
   }, [isQrModalOpen, fetchQrCode]);
  */
  // Chama fetchQrCode quando o componente monta e o usuário está autenticado
  /* useEffect(() => {
    if (isAuthenticated) {
      fetchQrCode();
    }
  }, [isAuthenticated, fetchQrCode]); */
  // 


  useEffect(() => {
    if (loading === false && !isAuthenticated) {
      router.push('/login'); // Redireciona se não estiver autenticado
    }
  }, [isAuthenticated, loading, router]);

  if (isAuthenticated === null) {
    return <p>Carregando informações de autenticação...</p>; // Ou um spinner de carregamento
  }

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Bem-vindo ao SaaS!</h1>
        <p>Por favor, <a href="/login">faça login</a> ou <a href="/register">cadastre-se</a> para continuar.</p>
      </div>
    );
  }

  const handleNavigateToProducts = () => {
    router.push('/products'); // Navega para a página /products
  };

  // Se autenticado, renderiza o formulário de configuração
  return (
    <main style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '28px' }}>Painel de Configurações</h1>
        {user && (
          <p style={{ margin: 0, fontSize: '16px', color: '#555' }}>Bem-vindo, <strong style={{ color: '#007bff' }}>{user.email}</strong>!</p>
        )}

        <CenteredButton href="/products">
          Produtos
        </CenteredButton>

        <button
          onClick={logout} // Chama a função logout do hook
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3577', // Vermelho para logout
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
        >
          Logout
        </button>
      </div>


      {isAuthenticated && <WhatsAppConnectButton userId={user?.id} userToken={user?.token} />}

      <QrCodeModal
        qrCode={currentQrCode}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        isLoading={qrLoading}
      />

      <ClientForm />

    </main>
  );
}