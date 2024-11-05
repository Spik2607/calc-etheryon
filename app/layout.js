import './globals.css';

export const metadata = {
  title: 'Calculatrice Etheryon',
  description: 'Calculatrice de points pour le jeu Etheryon',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
