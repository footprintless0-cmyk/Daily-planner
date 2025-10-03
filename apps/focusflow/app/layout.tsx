import './globals.css'
import Providers from '@/components/Providers';

export const metadata = {
  title: 'FocusFlow',
  description: 'Task Management and Focus Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}