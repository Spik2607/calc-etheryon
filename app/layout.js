import './globals.css';

export const metadata = {
  title: 'Calculatrice Etheryon',
  description: 'Calculateur de points pour le jeu Etheryon',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
