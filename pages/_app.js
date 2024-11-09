import { ThemeProvider } from 'next-themes'
import '../styles/globals.css'
import '../styles/medieval.css'  // Ajoutez cette ligne ici

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
