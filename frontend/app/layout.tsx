import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"
import { AuthProvider } from "@/components/auth/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Port Autonome de Nouadhibou",
  description: "Port maritime de Nouadhibou - Services portuaires et logistiques",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <AuthProvider>
          <MainHeader />
          <main>{children}</main>
          <MainFooter />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
