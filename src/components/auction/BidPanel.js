'use client'

import { useState, useEffect, useMemo, useActionState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  getSessionState,
  getRemainingMs,
  formatNaira
} from '@/lib/auction/session'
import { placeBid } from '@/lib/actions/bids'
import CountdownTimer from './CountdownTimer'

const initialFormState = { error: null, success: false }

export default function BidPanel({
  item,
  initialSession,
  initialBids,
  bidderName
}) {
  const [session, setSession] = useState(initialSession)
  const [bids, setBids] = useState(initialBids)
  const [now, setNow] = useState(() => Date.now())
  const [formState, formAction, isPending] = useActionState(
    placeBid,
    initialFormState
  )
  const formRef = useRef(null)
  const prevStartedAt = useRef(initialSession?.started_at)

  useEffect(() => {
    if (
      session?.started_at &&
      session.started_at !== prevStartedAt.current
    ) {
      setBids([])
    }
    prevStartedAt.current = session?.started_at
  }, [session?.started_at])

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`item-${item.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'auction_session' },
        (payload) => {
          if (payload.new) setSession(payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `item_id=eq.${item.id}`
        },
        (payload) => {
          setBids((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [item.id])

  useEffect(() => {
    if (formState.success && formRef.current) {
      formRef.current.reset()
    }
  }, [formState.success])

  const state = getSessionState(session, now)
  const remaining = getRemainingMs(session, now)

  const highestBid = useMemo(() => {
    if (bids.length === 0) return null
    return bids.reduce((max, bid) =>
      Number(bid.amount) > Number(max.amount) ? bid : max
    )
  }, [bids])

  const minRequired = highestBid
    ? Number(highestBid.amount) + 1
    : Number(item.startingBid)

  return (
    <div className='min-h-dvh px-4 py-6 sm:px-8 sm:py-10'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <Link
            href='/auction'
            className='text-sm text-zinc-700 transition hover:text-zinc-900'
          >
            ← Back to auction
          </Link>
          {state === 'active' && <CountdownTimer remaining={remaining} />}
        </div>

        <div className='grid gap-8 lg:grid-cols-2'>
          <div className='relative aspect-square overflow-hidden border border-zinc-900/15 bg-white/40'>
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes='(max-width: 1024px) 100vw, 50vw'
              priority
              className='object-cover'
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
              {highestBid ? (
                <>
                  <p className='text-xs uppercase tracking-widest text-zinc-500'>
                    Highest bid
                  </p>
                  <p className='mt-1 text-3xl font-bold text-primary'>
                    {formatNaira(highestBid.amount)}
                  </p>
                  <p className='text-sm text-zinc-600'>
                    by {highestBid.bidder_name}
                  </p>
                </>
              ) : (
                <p className='mt-1 text-sm text-zinc-500'>No bids yet</p>
              )}
            </div>

            {state === 'active' && item.isActive && (
              <form
                ref={formRef}
                action={formAction}
                className='flex flex-col gap-3 border-t border-zinc-900/10 pt-4'
              >
                <input type='hidden' name='itemId' value={item.id} />

                <div>
                  <p className='text-xs uppercase tracking-widest text-zinc-500'>
                    Bidding as
                  </p>
                  <p className='mt-1 font-semibold text-zinc-900'>
                    {bidderName}
                  </p>
                  <p className='mt-2 text-xs text-zinc-600'>
                    Minimum bid: {formatNaira(minRequired)}
                  </p>
                </div>

                <input
                  type='number'
                  name='amount'
                  min={minRequired}
                  step='1'
                  placeholder={`Amount (₦)`}
                  required
                  autoFocus
                  className='border border-zinc-900/20 bg-white/60 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900/50'
                />

                {formState.error && (
                  <p className='text-sm text-red-700'>{formState.error}</p>
                )}
                {formState.success && (
                  <p className='text-sm text-emerald-700'>
                    Bid placed successfully!
                  </p>
                )}

                <button
                  type='submit'
                  disabled={isPending}
                  className='bg-zinc-900 px-6 py-3 font-semibold text-primary transition hover:bg-zinc-800 active:scale-95 disabled:opacity-50'
                >
                  {isPending ? 'Placing bid…' : 'Place Bid'}
                </button>
              </form>
            )}

            {state === 'not_started' && (
              <p className='border-t border-zinc-900/10 pt-4 text-sm text-zinc-700'>
                Bidding hasn&apos;t started yet.
              </p>
            )}

            {state === 'ended' && (
              <p className='border-t border-zinc-900/10 pt-4 text-sm text-zinc-700'>
                Bidding has ended.
              </p>
            )}

            {state === 'active' && !item.isActive && (
              <p className='border-t border-zinc-900/10 pt-4 text-sm text-zinc-700'>
                This item is closed for bidding.
              </p>
            )}
          </div>
        </div>

        {bids.length > 0 && (
          <div className='mt-12'>
            <h2 className='mb-4 text-xl font-semibold text-zinc-900'>
              Bid history ({bids.length})
            </h2>
            <div className='max-h-96 overflow-y-auto border border-zinc-900/15 bg-white/40 backdrop-blur'>
              {bids.map((bid, i) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== bids.length - 1 ? 'border-b border-zinc-900/10' : ''
                  }`}
                >
                  <span className='font-medium text-zinc-900'>
                    {bid.bidder_name}
                  </span>
                  <span className='font-semibold text-primary'>
                    {formatNaira(bid.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
