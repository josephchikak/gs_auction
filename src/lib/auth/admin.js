import 'server-only'
import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'gs_admin'

const computeToken = () => {
  const secret = process.env.ADMIN_COOKIE_SECRET
  const password = process.env.ADMIN_PASSWORD
  return crypto.createHmac('sha256', secret).update(password).digest('hex')
}

export const setAdminCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, computeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8
  })
}

export const clearAdminCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export const isAdmin = async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  if (!cookie) return false
  return cookie.value === computeToken()
}
