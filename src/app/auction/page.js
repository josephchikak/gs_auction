import { createClient } from '@/lib/supabase/server'
import AuctionShell from '@/components/auction/AuctionShell'
import { getAuctionItems } from '@/lib/auction/items'

export const dynamic = 'force-dynamic'

export default async function AuctionPage() {
  const supabase = await createClient()

  const { data: bids } = await supabase
    .from('bids')
    .select('*')
    .order('created_at', { ascending: false })

  const items = await getAuctionItems()

  return <AuctionShell initialBids={bids ?? []} items={items} />
}
