import 'server-only'
import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'gs_bidder'
const SECRET = process.env.ADMIN_COOKIE_SECRET

const sign = (value) =>
  `${value}.${crypto.createHmac('sha256', SECRET).update(value).digest('hex')}`

const verify = (signed) => {
  if (!signed) return null
  const idx = signed.lastIndexOf('.')
  if (idx === -1) return null
  const value = signed.slice(0, idx)
  const sig = signed.slice(idx + 1)
  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(value)
    .digest('hex')
  return sig === expected ? value : null
}

export const setBidderCookie = async (bidderId) => {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sign(bidderId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  })
}

export const getBidderId = async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  return verify(cookie?.value)
}

export const clearBidderCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
