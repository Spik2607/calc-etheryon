import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" 
          rel="stylesheet"
        />
        <link 
          rel="preload" 
          href="/images/parchment-bg.png" 
          as="image"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
