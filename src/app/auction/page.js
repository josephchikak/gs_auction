import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBidderId } from '@/lib/auth/bidder'
import AuctionShell from '@/components/auction/AuctionShell'

export const dynamic = 'force-dynamic'

export default async function AuctionPage() {
  const bidderId = await getBidderId()
  if (!bidderId) redirect('/auction/register')

  const supabase = await createClient()

  const [{ data: session }, { data: bids }] = await Promise.all([
    supabase.from('auction_session').select('*').limit(1).single(),
    supabase.from('bids').select('*').order('created_at', { ascending: false })
  ])

  return (
    <AuctionShell initialSession={session} initialBids={bids ?? []} />
  )
}
