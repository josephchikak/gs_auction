import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { items, auctionMeta } from '@/data/items'
import { createClient } from '@/lib/supabase/server'
import {
  getSessionState,
  buildHighestBidMap,
  formatNaira
} from '@/lib/auction/session'

export const dynamic = 'force-dynamic'

export default async function WinnersPage() {
  const supabase = await createClient()

  const [{ data: session }, { data: bids }] = await Promise.all([
    supabase.from('auction_session').select('*').limit(1).single(),
    supabase.from('bids').select('*')
  ])

  const state = getSessionState(session)
  if (state !== 'ended') redirect('/auction')

  const highest = buildHighestBidMap(bids ?? [])

  return (
    <div className='min-h-dvh px-4 py-8 sm:px-8 sm:py-12'>
      <div className='mx-auto max-w-6xl'>
        <header className='mb-10 flex flex-col items-center text-center'>
          <Image
            src='/logo.png'
            alt={auctionMeta.title}
            width={160}
            height={160}
            priority
            className='h-24 w-24 sm:h-28 sm:w-28'
          />
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl'>
            Winners
          </h1>
          <p className='mt-2 text-sm text-zinc-700 sm:text-base'>
            {auctionMeta.title}
          </p>
          <p className='mt-1 text-xs uppercase tracking-widest text-zinc-500'>
            {auctionMeta.note}
          </p>
        </header>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((item) => {
            const winner = highest.get(item.id)
            return (
              <div
                key={item.id}
                className='flex flex-col overflow-hidden border border-zinc-900/15 bg-white/40 backdrop-blur'
              >
                <div className='relative aspect-square overflow-hidden bg-zinc-900/5'>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover'
                  />
                </div>

                <div className='flex flex-col gap-2 p-4'>
                  <div>
                    <p className='text-xs uppercase tracking-widest text-zinc-500'>
                      {item.category}
                    </p>
                    <h2 className='text-lg font-semibold text-zinc-900'>
                      {item.name}
                    </h2>
                  </div>

                  <div className='border-t border-zinc-900/10 pt-3'>
                    {winner ? (
                      <>
                        <p className='text-xs uppercase tracking-widest text-zinc-500'>
                          Winning bid
                        </p>
                        <p className='text-2xl font-bold text-primary'>
                          {formatNaira(winner.amount)}
                        </p>
                        <p className='mt-1 text-sm text-zinc-700'>
                          {winner.bidder_name}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className='text-xs uppercase tracking-widest text-zinc-500'>
                          Result
                        </p>
                        <p className='text-base text-zinc-600'>
                          No bids placed
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className='mt-12 text-center'>
          <Link
            href='/'
            className='inline-block bg-zinc-900 px-8 py-3 text-sm font-semibold text-primary shadow-lg transition hover:bg-zinc-800 active:scale-95'
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
