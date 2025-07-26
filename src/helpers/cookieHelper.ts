import Cookies from 'universal-cookie'

import type { User } from '@/models/User'

const cookies = new Cookies()

export const setUserCookie = (user: User) => {
  cookies.set('auth_user', JSON.stringify(user), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict',
    secure: true,
  })
}

export const getUserCookie = () => {
  const cookie = cookies.get('auth_user')
  return cookie ?? null
}

export const removeUserCookie = () => {
  cookies.remove('auth_user', { path: '/' })
}
