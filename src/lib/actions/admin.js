'use server'

import { redirect } from 'next/navigation'
import { setAdminCookie, clearAdminCookie } from '@/lib/auth/admin'

export const adminLogin = async (prevState, formData) => {
  const password = formData.get('password')

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Invalid password' }
  }

  await setAdminCookie()
  redirect('/admin')
}

export const adminLogout = async () => {
  await clearAdminCookie()
  redirect('/admin')
}
