import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactQueryClient } from '../components/providers/ReactQueryClient'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '코드 김밥',
  description: '코드 김밥 블로그 스터디 모임',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Toaster />
        <ReactQueryClient>{children}</ReactQueryClient>
      </body>
    </html>
  )
}