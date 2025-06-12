// app/layout.js
import './globals.css'
import ClientLayout from './client-layout' // <-- Wraps Client logic

export const metadata = {
  generator: 'v0.dev',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
