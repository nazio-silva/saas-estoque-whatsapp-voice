// estoque-saas/frontend/src/components/WhatsAppConnectButton.tsx

import React, { useState } from 'react';
import axios from 'axios'; // Certifique-se de ter o axios instalado: npm install axios
import QRCode from 'react-qr-code'; // Para exibir o QR Code: npm install react-qr-code

// Defina a URL base da sua API backend
const API_BASE_URL = 'http://localhost:3000/api'; // Ajuste conforme a porta do seu backend

interface WhatsAppConnectButtonProps {
  userId: string | undefined; // O ID do usuário logado que será passado para o serviço
  userToken: string | undefined; // O token JWT do usuário logado para autenticação
}

const WhatsAppConnectButton: React.FC<WhatsAppConnectButtonProps> = ({ userId, userToken }) => {

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleConnectWhatsApp = async () => {
    setLoading(true);
    setQrCode(null);
    setPairingCode(null);
    setError(null);
    setStatusMessage('Iniciando conexão com o WhatsApp...');

    try {
      // Faz a chamada para a sua nova rota de conexão no backend
      const response = await axios.post(
        `${API_BASE_URL}/connect/whatsapp/${userId}`,
        {}, // Body vazio ou dados adicionais se necessário
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Envia o token JWT para autenticação
          },
        }
      );

      const { message, qrCode, pairingCode: responsePairingCode } = response.data;

      setStatusMessage(message);

      if (qrCode) {
        setQrCode(qrCode);
        setStatusMessage('Escaneie o QR Code abaixo com seu WhatsApp.');
      } else if (responsePairingCode) {
        setPairingCode(responsePairingCode);
        setStatusMessage('Insira este código em web.whatsapp.com/pair.');
      } else {
        setStatusMessage('Sessão já conectada ou pronta para uso.');
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Erro ao conectar WhatsApp:', err);
      setError(err.response?.data?.message || 'Falha ao conectar WhatsApp. Tente novamente.');
      setStatusMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    setLoading(true);
    setError(null);
    setStatusMessage('Desconectando WhatsApp...');
    setQrCode(null); // Limpa o QR Code ao desconectar
    setPairingCode(null); // Limpa o Pairing Code ao desconectar

    try {
      await axios.post(
        `${API_BASE_URL}/disconnect/whatsapp/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setStatusMessage('WhatsApp desconectado com sucesso.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Erro ao desconectar WhatsApp:', err);
      setError(err.response?.data?.message || 'Falha ao desconectar WhatsApp.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>
      <h2>WhatsApp</h2>

      {!qrCode && !pairingCode && !loading && !statusMessage && (
        <p>Clique para conectar seu número de WhatsApp ao sistema.</p>
      )}

      {statusMessage && <p style={{ color: 'blue' }}>{statusMessage}</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {!qrCode && !pairingCode && ( // Só mostra o botão de conectar se não houver QR/Pairing Code
            <button
              onClick={handleConnectWhatsApp}
              disabled={loading}
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Conectar WhatsApp
            </button>
          )}

          {qrCode && (
            <div style={{ marginTop: '20px' }}>
              <p>Escaneie o QR Code:</p>
              <QRCode value={qrCode} size={256} level="H" /> {/* Use o componente react-qr-code */}
            </div>
          )}

          {pairingCode && (
            <div style={{ marginTop: '20px' }}>
              <p>Ou use o Código de Pareamento:</p>
              <pre style={{ fontWeight: 'bold', fontSize: '1.2em', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                {pairingCode}
              </pre>
              <p>Acesse <a href="https://web.whatsapp.com/pair" target="_blank" rel="noopener noreferrer">web.whatsapp.com/pair</a> e insira o código.</p>
            </div>
          )}

          {(qrCode || pairingCode) && ( // Mostra o botão de desconectar se houver QR/Pairing Code sendo exibido ou se a sessão já estiver estabelecida
             <button
                onClick={handleDisconnectWhatsApp}
                disabled={loading}
                style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Desconectar WhatsApp
              </button>
          )}
        </>
      )}
    </div>
  );
};

export default WhatsAppConnectButton;