import Cookies from 'js-cookie'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('user_token')}`,
    },
  }).then((res) => res.json())

export const dateDistanceToNow = (date: string) => {
  return formatDistanceToNow(new Date(date), { locale: id, addSuffix: true })
}
