import './globals.css'

export const metadata = {
  title: 'Where To Explore? Powered by GPT',
  description: 'A GPT-Powered Voice App that recommends you places to explore or check out',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
