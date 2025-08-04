// frontend-next/src/components/QrCodeModal.tsx
'use client'; // Indica que este é um Client Component no Next.js

import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

interface QrCodeModalProps {
  qrCode: string | null; // A string do QR Code fornecida pelo backend
  isOpen: boolean;       // Booleano para controlar a visibilidade do modal
  onClose: () => void;   // Função para fechar o modal
  isLoading: boolean;    // Booleano para indicar se o QR Code está sendo carregado
}

/**
 * QrCodeModal é um componente de modal que exibe um QR Code para conexão do WhatsApp.
 * Ele permite que o usuário escaneie o código com o aplicativo WhatsApp no celular.
 */
export default function QrCodeModal({ qrCode, isOpen, onClose, isLoading }: QrCodeModalProps) {
  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        {/* Botão para fechar o modal */}
        <button onClick={onClose} style={closeButtonStyle}>
          &times;
        </button>

        <h2 style={titleStyle}>Conecte seu WhatsApp</h2>
        <p style={descriptionStyle}>
          Para usar o bot, escaneie o QR Code abaixo com seu celular.<br />
          Vá em **WhatsApp** &gt; **Configurações** &gt; **Aparelhos Conectados** &gt; **Conectar um Aparelho**.
        </p>

        {/* Exibe mensagem de carregamento ou o QR Code */}
        {isLoading ? (
          <div style={loadingStyle}>
            Carregando QR Code...
          </div>
        ) : qrCode ? (
          // Se houver um QR Code, renderiza-o
          <div style={qrCodeWrapperStyle}>
            <QRCodeSVG value={qrCode} size={256} level="H" fgColor="#000000" bgColor="#FFFFFF" />
          </div>
        ) : (
          // Se não houver QR Code e não estiver carregando (ex: bot já conectado, ou erro)
          <div style={noQrCodeStyle}>
            Nenhum QR Code disponível no momento.<br/> O bot pode já estar conectado ou aguardando.
          </div>
        )}

        {qrCode && (
          <p style={expiryTextStyle}>
            *O QR Code expira após um tempo. Se não conseguir escanear, feche e abra o modal novamente para tentar gerar um novo.
          </p>
        )}
      </div>
    </div>
  );
}

// --- Estilos CSS Inline ---
// Isso permite que o componente seja auto-contido e funcione sem arquivos CSS externos.

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo escuro semi-transparente
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000, // Garante que o modal esteja acima de outros elementos
  backdropFilter: 'blur(5px)', // Efeito de desfoque no fundo
  WebkitBackdropFilter: 'blur(5px)' // Suporte para navegadores Webkit
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)', // Sombra para dar profundidade
  textAlign: 'center',
  maxWidth: '450px',
  width: '90%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px', // Espaçamento entre os elementos do modal
  animation: 'fadeInScale 0.3s ease-out forwards' // Animação de entrada
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '28px', // Ícone de fechar maior
  cursor: 'pointer',
  color: '#888',
  lineHeight: '1',
  padding: '5px',
  transition: 'color 0.2s ease',
};
// closeButtonStyle[':hover'] = {
//   color: '#333',
// };

const titleStyle: React.CSSProperties = {
  color: '#333',
  marginBottom: '10px',
  fontSize: '28px',
  fontWeight: '600'
};

const descriptionStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '15px'
};

const loadingStyle: React.CSSProperties = {
  padding: '20px',
  fontSize: '18px',
  color: '#007bff',
  fontWeight: 'bold'
};

const qrCodeWrapperStyle: React.CSSProperties = {
  border: '2px solid #ddd',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9'
};

const noQrCodeStyle: React.CSSProperties = {
  padding: '20px',
  fontSize: '16px',
  color: '#dc3545', // Vermelho para mensagens de atenção
  fontWeight: '500'
};

const expiryTextStyle: React.CSSProperties = {
  color: '#999',
  fontSize: '12px',
  marginTop: '10px'
};