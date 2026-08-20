'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isAdmin, setAdminCookie, clearAdminCookie } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { uploadProductImage } from '@/lib/storage/s3'

const toItemId = (name) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `${slug}-${Date.now().toString(36)}`
}

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

export const createItem = async (prevState, formData) => {
  if (!await isAdmin()) {
    return { error: 'You must be logged in as an admin', success: false }
  }

  const name = formData.get('name')?.toString().trim()
  const description = formData.get('description')?.toString().trim()
  const image = formData.get('image')
  const startingBid = Number(formData.get('price'))

  if (!name || !description || !image || !Number.isInteger(startingBid) || startingBid < 0) {
    return { error: 'Complete all fields with a valid price', success: false }
  }

  const itemId = toItemId(name)
  let imageUrl
  try {
    imageUrl = await uploadProductImage(image, itemId)
  } catch (error) {
    return { error: error.message, success: false }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('auction_items').insert({
    id: itemId,
    name,
    description,
    category: 'Artwork',
    image: imageUrl,
    starting_bid: startingBid,
    is_active: true
  })

  if (error) {
    if (error.code === '42P01' || error.code === 'PGRST205') {
      return {
        error: 'The auction_items table is missing. Run the auction items migration in Supabase SQL Editor.',
        success: false
      }
    }

    return { error: 'Unable to add this product. Please try again.', success: false }
  }

  revalidatePath('/admin')
  revalidatePath('/auction')

  return { error: null, success: true }
}

export const deleteItem = async (formData) => {
  if (!await isAdmin()) return

  const itemId = formData.get('itemId')?.toString().trim()
  if (!itemId) return

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('auction_items')
    .delete()
    .eq('id', itemId)
    .select('id')

  if (error || !data?.length) return

  revalidatePath('/admin')
  revalidatePath('/auction')
  revalidatePath('/auction/winners')
}
