'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export const acceptPurchase = async (formData) => {
  if (!await isAdmin()) return

  const orderId = formData.get('orderId')?.toString().trim()
  const itemId = formData.get('itemId')?.toString().trim()

  if (!orderId || !itemId) return

  const supabase = createAdminClient()

  await supabase
    .from('bids')
    .update({ status: 'accepted' })
    .eq('id', orderId)

  revalidatePath('/admin')
  revalidatePath('/auction')
  revalidatePath(`/auction/${itemId}`)
  revalidatePath('/auction/winners')
}

export const resetPurchase = async (formData) => {
  if (!await isAdmin()) return

  const orderId = formData.get('orderId')?.toString().trim()
  const itemId = formData.get('itemId')?.toString().trim()

  if (!orderId || !itemId) return

  const supabase = createAdminClient()

  await supabase
    .from('bids')
    .update({ status: 'pending' })
    .eq('id', orderId)
    .eq('status', 'accepted')

  revalidatePath('/admin')
  revalidatePath('/auction')
  revalidatePath(`/auction/${itemId}`)
  revalidatePath('/auction/winners')
}
