import { ThemeProvider } from 'next-themes'
import { AnimatePresence } from 'framer-motion'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Component {...pageProps} />
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
