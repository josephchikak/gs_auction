'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { auctionMeta } from '@/data/items'
import { createClient } from '@/lib/supabase/client'
import AuctionGrid from './AuctionGrid'

export default function AuctionShell({ initialBids, items }) {
  const [bids, setBids] = useState(initialBids)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('shop-shell')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bids' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBids((prev) => [payload.new, ...prev])
            return
          }

          if (payload.eventType === 'UPDATE') {
            setBids((prev) =>
              prev.map((bid) =>
                bid.id === payload.new.id ? payload.new : bid
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className='min-h-dvh px-4 pb-16 pt-6 sm:px-8 sm:pt-10'>
      <header className='mx-auto mb-8 flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left'>
        <Link href='/' className='flex items-center gap-3'>
          <Image
            src='/logo.png'
            alt={auctionMeta.title}
            width={80}
            height={80}
            className='h-12 w-12 sm:h-16 sm:w-16'
          />
          <div>
            <h1 className='text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl'>
              {auctionMeta.title}
            </h1>
            <p className='text-xs uppercase tracking-widest text-zinc-500'>
              {auctionMeta.note}
            </p>
          </div>
        </Link>
        <p className='max-w-md text-sm text-zinc-700'>
          Select a piece to request purchase. Admin-approved orders are marked sold.
        </p>
      </header>

      <main className='mx-auto max-w-6xl'>
        <AuctionGrid bids={bids} items={items} />
      </main>
    </div>
  )
}
