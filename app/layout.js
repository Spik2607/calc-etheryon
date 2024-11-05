import './globals.css'

export const metadata = {
  title: 'Calculatrice Etheryon',
  description: 'Calculatrice de points pour le jeu Etheryon',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
}
