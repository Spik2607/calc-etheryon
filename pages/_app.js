import '../styles/globals.css'
import { Inter } from 'next/font/google'

// Si vous utilisez une police personnalisée, configurez-la ici
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <main className={`${inter.className} min-h-screen bg-background`}>
      <Component {...pageProps} />
    </main>
  )
}
