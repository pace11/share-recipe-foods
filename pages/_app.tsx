import '@/styles/globals.css'
import 'react-quill/dist/quill.snow.css'
import type { AppProps } from 'next/app'
import MainLayout from '@/layout'
import { Toaster } from '@/components/ui/sonner'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Toaster />
      <Component {...pageProps} />
    </MainLayout>
  )
}
