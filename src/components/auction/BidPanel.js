'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  buildAcceptedPurchaseMap,
  formatNaira
} from '@/lib/auction/session'

export default function BidPanel({ item, initialBids }) {
  const [bids, setBids] = useState(initialBids)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`shop-item-${item.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids',
          filter: `item_id=eq.${item.id}`
        },
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
  }, [item.id])

  const sale = useMemo(
    () => buildAcceptedPurchaseMap(bids).get(item.id) ?? null,
    [bids, item.id]
  )

  const isSold = Boolean(sale)

  return (
    <div className='min-h-dvh px-4 py-6 sm:px-8 sm:py-10'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <Link
            href='/auction'
            className='text-sm text-zinc-700 transition hover:text-zinc-900'
          >
            ← Back to pieces
          </Link>
        </div>

        <div className='grid gap-8 lg:grid-cols-2'>
          <div className='relative aspect-square overflow-hidden border border-zinc-900/15 bg-white/40'>
            <img
              src={item.image}
              alt={item.name}
              className='absolute inset-0 h-full w-full object-cover'
            />
          </div>

          <div className='flex flex-col gap-6'>
            <div>
              <p className='text-xs uppercase tracking-widest text-zinc-500'>
                {item.category}
              </p>
              <h1 className='mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl'>
                {item.name}
              </h1>
              <p className='mt-3 text-sm text-zinc-700 sm:text-base'>
                {item.description}
              </p>
            </div>

            <div className='border-t border-zinc-900/10 pt-4'>
              {isSold ? (
                <>
                  <p className='text-xs uppercase tracking-widest text-zinc-500'>
                    Sold
                  </p>
                  <p className='mt-1 text-3xl font-bold text-primary'>
                    {formatNaira(sale.amount)}
                  </p>
                  <p className='text-sm text-zinc-600'>Order accepted. This one-of-one piece is no longer available.</p>
                </>
              ) : (
                <>
                  <p className='text-xs uppercase tracking-widest text-zinc-500'>
                    Fixed Price
                  </p>
                  <p className='mt-1 text-3xl font-bold text-primary'>
                    {formatNaira(item.startingBid)}
                  </p>
                </>
              )}
            </div>

            {!isSold && item.isActive && (
              <div className='border-t border-zinc-900/10 pt-4'>
                <Link
                  href={`/auction/register?itemId=${item.id}`}
                  className='inline-flex w-full justify-center bg-zinc-900 px-6 py-3 font-semibold text-primary transition hover:bg-zinc-800 active:scale-95 sm:w-auto'
                >
                  Buy
                </Link>
                <p className='mt-3 text-sm text-zinc-700'>
                  You&apos;ll fill in your details and the team will contact you to complete the purchase.
                </p>
              </div>
            )}

            {!item.isActive && (
              <p className='border-t border-zinc-900/10 pt-4 text-sm text-zinc-700'>
                This item is currently unavailable.
              </p>
            )}
          </div>
        </div>

        {isSold && (
          <div className='mt-12'>
            <h2 className='mb-4 text-xl font-semibold text-zinc-900'>
              Order status
            </h2>
            <div className='max-h-96 overflow-y-auto border border-zinc-900/15 bg-white/40 backdrop-blur'>
              <div className='flex items-center justify-between px-4 py-3'>
                <span className='font-medium text-zinc-900'>
                  Sold
                </span>
                <span className='font-semibold text-primary'>
                  {formatNaira(sale.amount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
