// frontend-next/src/app/layout.tsx
import './globals.css'; // Estilos globais (pode ser reset ou CSS personalizado)
import type { Metadata } from "next";
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Stock Voice',
    template: '%s | Stock Voice',
  },
  keywords: ['Stock Voice', 'Configuração', 'Bot de Voz', 'WhatsApp'],
  creator: 'Názio Silva',
  description: 'Configure a integração do seu sistema de estoque com o bot de voz do WhatsApp.',
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}