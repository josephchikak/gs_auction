import { createClient } from '@/lib/supabase/server'
import { items as staticItems } from '@/data/items'

const normalizeImageUrl = (url) => {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (!match) return url

  return `https://drive.google.com/uc?export=view&id=${match[1]}`
}

const mapDatabaseItem = (item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  category: item.category,
  image: normalizeImageUrl(item.image),
  startingBid: item.starting_bid,
  isActive: item.is_active,
  isCustom: true
})

export const getAuctionItems = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('auction_items')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) return staticItems

  return [...staticItems, ...(data ?? []).map(mapDatabaseItem)]
}

export const getAuctionItemById = async (id) => {
  const staticItem = staticItems.find((item) => item.id === id)
  if (staticItem) return staticItem

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('auction_items')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null

  return mapDatabaseItem(data)
}
