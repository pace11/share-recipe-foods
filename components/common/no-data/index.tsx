import { Inbox } from 'lucide-react'

type NoDataProps = {
  title?: string
}

export default function NoData({ title = 'No Data' }: NoDataProps) {
  return (
    <div className="container flex items-center justify-center flex-col">
      <Inbox size={60} strokeWidth={1} />
      <p>{title}</p>
    </div>
  )
}
