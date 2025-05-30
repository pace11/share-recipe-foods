import Cookies from 'js-cookie'

export async function mutateApi<T = unknown>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown,
  headers?: HeadersInit,
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('user_token')}`,
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(
      errorData.message || errorData.errors || 'API mutation failed',
    )
  }

  return res.json()
}
