import { create } from 'zustand'
import Cookies from 'js-cookie'

type AuthState = {
  isLoggedIn: boolean
  setIsLoggedIn: (expire: string, token: string) => void
  logout: () => void
}

export const authStore = create<AuthState>((set) => ({
  isLoggedIn: !!Cookies.get('user_token'),
  setIsLoggedIn: (expire, token) => {
    Cookies.set('user_token', token, {
      expires: new Date(expire),
      path: '/',
    })
    set({ isLoggedIn: !!token })
  },
  logout: () => {
    Cookies.remove('user_token', { path: '/' })
    set({ isLoggedIn: false })
  },
}))
