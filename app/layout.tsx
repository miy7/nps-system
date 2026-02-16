import "./globals.css"
import AppShell from "./components/AppShell"

export const metadata = {
  title: "NPS Logistics",
  description: "Modern Logistics SaaS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
