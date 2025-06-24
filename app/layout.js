import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GRIZALUM Cloud - Sistema de Gestión de Préstamos',
  description: 'Sistema completo para gestionar préstamos, pagos y clientes en la nube. Accesible desde cualquier dispositivo.',
  keywords: 'prestamos, gestion, finanzas, grizalum, cloud, sistema',
  authors: [{ name: 'GRIZALUM' }],
  creator: 'GRIZALUM',
  publisher: 'GRIZALUM',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'GRIZALUM Cloud - Sistema de Gestión de Préstamos',
    description: 'Sistema completo para gestionar préstamos, pagos y clientes en la nube.',
    type: 'website',
    locale: 'es_PE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GRIZALUM Cloud - Sistema de Gestión de Préstamos',
    description: 'Sistema completo para gestionar préstamos, pagos y clientes en la nube.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ff4500" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
