import { notFound } from 'next/navigation'
import { getAuctionItemById } from '@/lib/auction/items'
import { createClient } from '@/lib/supabase/server'
import BidPanel from '@/components/auction/BidPanel'

export const dynamic = 'force-dynamic'

export default async function ItemPage({ params }) {
  const { id } = await params
  const item = await getAuctionItemById(id)
  if (!item) notFound()

  const supabase = await createClient()

  const { data: bids } = await supabase
    .from('bids')
    .select('*')
    .eq('item_id', id)
    .order('created_at', { ascending: false })

  return (
    <BidPanel
      item={item}
      initialBids={bids ?? []}
    />
  )
}
