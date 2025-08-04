import './globals.css';
import '@mantine/core/styles.css';
import { Providers } from '../components/providers';

export const metadata = {
  title: 'SOP Front',
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
