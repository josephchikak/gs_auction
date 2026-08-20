'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuctionItemById } from '@/lib/auction/items'
import { createAdminClient } from '@/lib/supabase/admin'
import { setBidderCookie } from '@/lib/auth/bidder'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidPhone = (phone) => /^[+\d][\d\s\-()]{6,}$/.test(phone)
const getDatabaseErrorMessage = (error) => {
  if (!error) return 'Unable to save your details. Please try again.'

  const message = error.message ?? String(error)

  if (
    message.includes('<!DOCTYPE html>') ||
    message.includes('Error code 521') ||
    message.includes('Web server is down')
  ) {
    return 'The database is temporarily unavailable. Please try again in a few minutes.'
  }

  return message
}

export const registerBidder = async (prevState, formData) => {
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim().toLowerCase()
  const phone = formData.get('phone')?.toString().trim()

  if (!name || !email || !phone) {
    return { error: 'All fields are required', success: false }
  }
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address', success: false }
  }
  if (!isValidPhone(phone)) {
    return { error: 'Please enter a valid phone number', success: false }
  }

  const supabase = createAdminClient()
  const { bidderId, error } = await upsertBidder(supabase, {
    name,
    email,
    phone
  })

  if (error) return { error, success: false }

  await setBidderCookie(bidderId)
  redirect('/auction')
}

export const requestPurchase = async (prevState, formData) => {
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim().toLowerCase()
  const phone = formData.get('phone')?.toString().trim()
  const itemId = formData.get('purchaseItemId')?.toString().trim()

  if (!name || !email || !phone || !itemId) {
    return { error: 'All fields are required', success: false }
  }
  if (!isValidEmail(email)) {
    return { error: 'Please enter a valid email address', success: false }
  }
  if (!isValidPhone(phone)) {
    return { error: 'Please enter a valid phone number', success: false }
  }

  const item = await getAuctionItemById(itemId)
  if (!item || !item.isActive) {
    return { error: 'This item is not available for purchase', success: false }
  }

  const supabase = createAdminClient()
  const { bidderId, error: bidderError } = await upsertBidder(supabase, {
    name,
    email,
    phone
  })

  if (bidderError) return { error: bidderError, success: false }

  const { data: existingSale, error: saleCheckError } = await supabase
    .from('bids')
    .select('id')
    .eq('item_id', item.id)
    .eq('status', 'accepted')
    .limit(1)
    .maybeSingle()

  if (saleCheckError) {
    return { error: getDatabaseErrorMessage(saleCheckError), success: false }
  }
  if (existingSale) {
    return { error: 'This piece has already been sold', success: false }
  }

  const { error } = await supabase.from('bids').insert({
    item_id: item.id,
    bidder_name: name,
    bidder_email: email,
    bidder_phone: phone,
    amount: item.startingBid,
    status: 'pending'
  })

  if (error) {
    if (error.message?.includes("Could not find the 'status' column")) {
      return {
        error: 'Please add the purchase status column in Supabase before accepting orders.',
        success: false
      }
    }

    return { error: getDatabaseErrorMessage(error), success: false }
  }

  await setBidderCookie(bidderId)
  revalidatePath(`/auction/${item.id}`)
  revalidatePath('/auction')

  return { error: null, success: true, itemId: item.id }
}

const upsertBidder = async (supabase, { name, email, phone }) => {
  const { data: existing, error: findError } = await supabase
    .from('bidders')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (findError) {
    return { bidderId: null, error: getDatabaseErrorMessage(findError) }
  }

  if (existing) {
    const { error } = await supabase
      .from('bidders')
      .update({ name, phone })
      .eq('id', existing.id)

    if (error) {
      return { bidderId: null, error: getDatabaseErrorMessage(error) }
    }

    return { bidderId: existing.id, error: null }
  }

  const { data, error } = await supabase
    .from('bidders')
    .insert({ name, email, phone })
    .select('id')
    .single()

  if (error) return { bidderId: null, error: getDatabaseErrorMessage(error) }

  return { bidderId: data.id, error: null }
}
