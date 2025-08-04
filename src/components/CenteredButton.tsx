// estoque-saas/frontend/components/CenteredButton.jsx
import React from 'react';
import Link from 'next/link'; // Usamos Link do Next.js para navegação

// Estilos para este botão - pode ser um CSS Module ou CSS global
// import styles from './CenteredButton.module.css'; // Exemplo de CSS Module

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CenteredButton = ({ children, href, onClick }: any) => {
  // Se for um link (navegação entre páginas)
  if (href) {
    return (
        <Link href={href} passHref>
            {children}
        </Link>
    );
  }

  // Se for um botão de ação (com onClick)
  return (
    <div className="button-container"> {/* Container para centralizar */}
      <button type="button" onClick={onClick} className="custom-button">
        {children}
      </button>
    </div>
  );
};

export default CenteredButton;