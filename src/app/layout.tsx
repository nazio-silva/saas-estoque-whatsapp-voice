// frontend-next/src/app/layout.tsx
import './globals.css'; // Estilos globais (pode ser reset ou CSS personalizado)

export const metadata = {
  title: 'Estoque Voz SaaS - Configuração',
  description: 'Configure a integração do seu sistema de estoque com o bot de voz do WhatsApp.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}