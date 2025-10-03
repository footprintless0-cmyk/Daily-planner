import './globals.css'

export const metadata = {
  title: 'FocusFlow',
  description: 'Task Management and Focus Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}