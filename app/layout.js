import './globals.css'
import { AuthProvider } from '@/lib/contexts/AuthContext'

export const metadata = {
  title: 'SL Cinnamon',
  description: 'Sri Lankan Cinnamon Marketplace',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
