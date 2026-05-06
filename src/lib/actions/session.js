'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const getSessionRow = async (supabase) => {
  const { data, error } = await supabase
    .from('auction_session')
    .select('id')
    .limit(1)
    .single()

  if (error || !data) return null
  return data
}

export const startBidding = async () => {
  if (!(await isAdmin())) return { error: 'Unauthorized' }

  const supabase = createAdminClient()
  const session = await getSessionRow(supabase)
  if (!session) return { error: 'No session row found' }

  const { error } = await supabase
    .from('auction_session')
    .update({
      started_at: new Date().toISOString(),
      ended_manually: false
    })
    .eq('id', session.id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/auction')
  return { success: true }
}

export const endBidding = async () => {
  if (!(await isAdmin())) return { error: 'Unauthorized' }

  const supabase = createAdminClient()
  const session = await getSessionRow(supabase)
  if (!session) return { error: 'No session row found' }

  const { error } = await supabase
    .from('auction_session')
    .update({ ended_manually: true })
    .eq('id', session.id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/auction')
  return { success: true }
}
