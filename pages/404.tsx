import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="container flex items-center justify-center flex-col pt-18">
      <FileQuestion size={130} strokeWidth={1.5} />
      <p className="text-2xl mt-6">Page Not Found</p>
      <p>
        Back to{' '}
        <Link href="/" className="font-semibold hover:underline">
          Home
        </Link>{' '}
      </p>
    </div>
  )
}
