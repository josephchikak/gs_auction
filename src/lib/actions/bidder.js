'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { setBidderCookie } from '@/lib/auth/bidder'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidPhone = (phone) => /^[+\d][\d\s\-()]{6,}$/.test(phone)

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

  const { data: existing } = await supabase
    .from('bidders')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  let bidderId

  if (existing) {
    bidderId = existing.id
    await supabase
      .from('bidders')
      .update({ name, phone })
      .eq('id', bidderId)
  } else {
    const { data, error } = await supabase
      .from('bidders')
      .insert({ name, email, phone })
      .select('id')
      .single()

    if (error) return { error: error.message, success: false }
    bidderId = data.id
  }

  await setBidderCookie(bidderId)
  redirect('/auction')
}
