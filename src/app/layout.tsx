import './globals.css';

import { Providers } from '../components/providers';

export const metadata = {
  title: 'Seu projeto',
  description: 'Descrição',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
