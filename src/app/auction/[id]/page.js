import { notFound, redirect } from 'next/navigation'
import { getItemById } from '@/data/items'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBidderId } from '@/lib/auth/bidder'
import BidPanel from '@/components/auction/BidPanel'

export const dynamic = 'force-dynamic'

export default async function ItemPage({ params }) {
  const bidderId = await getBidderId()
  if (!bidderId) redirect('/auction/register')

  const { id } = await params
  const item = getItemById(id)
  if (!item) notFound()

  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const [{ data: session }, { data: bids }, { data: bidder }] =
    await Promise.all([
      supabase.from('auction_session').select('*').limit(1).single(),
      supabase
        .from('bids')
        .select('*')
        .eq('item_id', id)
        .order('created_at', { ascending: false }),
      adminSupabase
        .from('bidders')
        .select('name')
        .eq('id', bidderId)
        .maybeSingle()
    ])

  if (!bidder) redirect('/auction/register')

  return (
    <BidPanel
      item={item}
      initialSession={session}
      initialBids={bids ?? []}
      bidderName={bidder.name}
    />
  )
}
