import "./globals.css"
import Link from "next/link"

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
      <body className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">

        {/* Navbar */}
        <nav className="bg-white/70 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🚀 NPS 
            </Link>

           

          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </main>

      </body>
    </html>
  )
}
