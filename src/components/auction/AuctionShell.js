'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { auctionMeta } from '@/data/items'
import { createClient } from '@/lib/supabase/client'
import { getSessionState, getRemainingMs } from '@/lib/auction/session'
import CountdownTimer from './CountdownTimer'
import AuctionGrid from './AuctionGrid'

export default function AuctionShell({ initialSession, initialBids }) {
  const [session, setSession] = useState(initialSession)
  const [bids, setBids] = useState(initialBids)
  const [now, setNow] = useState(() => Date.now())
  const prevStartedAt = useRef(initialSession?.started_at)

  useEffect(() => {
    if (session?.started_at !== prevStartedAt.current) {
      setBids([])
      prevStartedAt.current = session?.started_at
    }
  }, [session?.started_at])

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('auction-shell')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'auction_session' },
        (payload) => {
          if (payload.new) setSession(payload.new)
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids' },
        (payload) => {
          setBids((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const state = getSessionState(session, now)
  const remaining = getRemainingMs(session, now)

  if (state === 'not_started') {
    return (
      <div className='flex min-h-dvh flex-col items-center justify-center px-6 text-center'>
        <Image
          src='/logo.png'
          alt={auctionMeta.title}
          width={200}
          height={200}
          priority
          className='h-32 w-32 sm:h-40 sm:w-40'
        />
        <h1 className='mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl'>
          Bidding hasn&apos;t started yet
        </h1>
        <p className='mt-3 max-w-md text-sm text-zinc-700 sm:text-base'>
          Stay tuned — the auction will go live when the host opens the floor.
        </p>
        <p className='mt-6 text-xs uppercase tracking-widest text-zinc-500'>
          {auctionMeta.note}
        </p>
      </div>
    )
  }

  if (state === 'ended') {
    return (
      <div className='flex min-h-dvh flex-col items-center justify-center px-6 text-center'>
        <Image
          src='/logo.png'
          alt={auctionMeta.title}
          width={200}
          height={200}
          priority
          className='h-32 w-32 sm:h-40 sm:w-40'
        />
        <h1 className='mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl'>
          Bidding has ended
        </h1>
        <p className='mt-3 max-w-md text-sm text-zinc-700 sm:text-base'>
          Thanks for joining. Winners will be announced shortly.
        </p>
        <Link
          href='/auction/winners'
          className='mt-6 bg-zinc-900 px-8 py-3 text-sm font-semibold text-primary shadow-lg transition hover:bg-zinc-800 active:scale-95'
        >
          View Winners
        </Link>
      </div>
    )
  }

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
        <CountdownTimer remaining={remaining} />
      </header>

      <main className='mx-auto max-w-6xl'>
        <AuctionGrid bids={bids} />
      </main>
    </div>
  )
}
