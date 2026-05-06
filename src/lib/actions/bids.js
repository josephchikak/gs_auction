'use server'

import { revalidatePath } from 'next/cache'
import { getItemById } from '@/data/items'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSessionState, formatNaira } from '@/lib/auction/session'
import { getBidderId } from '@/lib/auth/bidder'

export const placeBid = async (prevState, formData) => {
  const bidderId = await getBidderId()
  if (!bidderId) {
    return {
      error: 'Your registration has expired. Please register again.',
      success: false
    }
  }

  const itemId = formData.get('itemId')?.toString().trim()
  const amountRaw = formData.get('amount')?.toString().trim()

  if (!itemId || !amountRaw) {
    return { error: 'Bid amount is required', success: false }
  }

  const amount = Number(amountRaw)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'Please enter a valid bid amount', success: false }
  }

  const item = getItemById(itemId)
  if (!item || !item.isActive) {
    return { error: 'Item is not available for bidding', success: false }
  }

  const supabase = createAdminClient()

  const { data: bidder, error: bidderErr } = await supabase
    .from('bidders')
    .select('*')
    .eq('id', bidderId)
    .single()

  if (bidderErr || !bidder) {
    return {
      error: 'Your registration is invalid. Please register again.',
      success: false
    }
  }

  const { data: session } = await supabase
    .from('auction_session')
    .select('*')
    .limit(1)
    .single()

  if (getSessionState(session) !== 'active') {
    return { error: 'Bidding is not currently active', success: false }
  }

  const { data: highestBid } = await supabase
    .from('bids')
    .select('amount')
    .eq('item_id', itemId)
    .order('amount', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (highestBid && amount <= Number(highestBid.amount)) {
    return {
      error: `Bid must be higher than current highest of ${formatNaira(highestBid.amount)}`,
      success: false
    }
  }

  if (!highestBid && amount < Number(item.startingBid)) {
    return {
      error: `Minimum starting bid is ${formatNaira(item.startingBid)}`,
      success: false
    }
  }

  const { error } = await supabase.from('bids').insert({
    item_id: itemId,
    bidder_name: bidder.name,
    bidder_email: bidder.email,
    bidder_phone: bidder.phone,
    amount
  })

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath(`/auction/${itemId}`)
  revalidatePath('/auction')

  return { error: null, success: true, amount }
}
