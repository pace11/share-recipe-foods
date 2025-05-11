import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import Head from 'next/head'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import { authStore } from '@/store/authStore'
import { useState, useEffect } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasMounted, setHasMounted] = useState<boolean>(false)
  const isLoggedIn = authStore((s) => s.isLoggedIn)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return (
    <>
      <Head>
        <title>Share Recipe Foods</title>
        <meta name="description" content="Share recipe foods with simplicity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${geistSans.variable} ${geistMono.variable} container w-full max-w-sm mx-auto`}
      >
        <header className="p-2 sticky top-0">
          {isLoggedIn && (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <Link href="/">Home</Link>
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>
                  <Link href="/profile">Profile</Link>
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>
                  <Link href="/notifications">Notifications</Link>
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
          )}
        </header>
        <div className="mx-auto p-2">{children}</div>
      </div>
    </>
  )
}
