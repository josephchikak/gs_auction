'use client'

import { useState, useEffect, useTransition, useMemo, useRef } from 'react'
import { items } from '@/data/items'
import { startBidding, endBidding, pauseBidding } from '@/lib/actions/session'
import { adminLogout } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'
import { formatNaira } from '@/lib/auction/session'

const getSessionState = (session, now) => {
  if (!session?.started_at) return 'not_started'
  if (session.ended_manually) return 'ended'
  const endsAt = new Date(session.started_at).getTime() + session.duration_minutes * 60 * 1000
  return now < endsAt ? 'active' : 'ended'
}

const computeRemaining = (session, now) => {
  if (!session?.started_at) return null
  const endsAt = new Date(session.started_at).getTime() + session.duration_minutes * 60 * 1000
  return Math.max(0, endsAt - now)
}

const formatTime = (ms) => {
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const buildHighestMap = (bids) => {
  const map = new Map()
  for (const bid of bids) {
    const current = map.get(bid.item_id)
    if (!current || Number(bid.amount) > Number(current.amount)) {
      map.set(bid.item_id, bid)
    }
  }
  return map
}

export default function AdminPanel({ initialSession, initialBids }) {
  const [session, setSession] = useState(initialSession)
  const [bids, setBids] = useState(initialBids)
  const [now, setNow] = useState(() => Date.now())
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
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('admin-realtime')
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

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const state = getSessionState(session, now)
  const remaining = computeRemaining(session, now)
  const highest = useMemo(() => buildHighestMap(bids), [bids])

  const handleStart = () =>
    startTransition(async () => {
      const result = await startBidding()
      if (result?.error) console.error(result.error)
    })

  const handleEnd = () =>
    startTransition(async () => {
      const result = await endBidding()
      if (result?.error) console.error(result.error)
    })

  const handlePause = () =>
    startTransition(async () => {
      const result = await pauseBidding()
      if (result?.error) console.error(result.error)
    })

  const handleLogout = () => startTransition(() => adminLogout())

  return (
    <div className='mx-auto max-w-5xl p-6'>
      <header className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Admin</h1>
        <button
          onClick={handleLogout}
          className='text-sm text-primary transition hover:text-primary'
        >
          Sign out
        </button>
      </header>

      <div className='mb-8 text-primary border border-white/10 bg-background p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-wide text-primary'>Session</p>
            <p className='mt-1 text-2xl font-semibold capitalize'>
              {state.replace('_', ' ')}
            </p>
            {state === 'active' && remaining !== null && (
              <p className='mt-2 font-mono text-xl text-primary'>
                {formatTime(remaining)}
              </p>
            )}
          </div>
          <div className='flex gap-3'>
            {state === 'not_started' && (
              <button
                onClick={handleStart}
                disabled={isPending}
                className='rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-black transition hover:bg-emerald-600 disabled:opacity-50'
              >
                Start Bidding
              </button>
            )}
            {state === 'active' && (
              <>
                <button
                  onClick={handleEnd}
                  disabled={isPending}
                  className=' bg-red-500 text-black px-6 py-3 font-semibold  transition hover:bg-red-400 disabled:opacity-50'
                >
                  End Early
                </button>
                <button
                  onClick={handlePause}
                  disabled={isPending}
                  className='bg-zinc-700 text-primary px-6 py-3 font-semibold transition hover:bg-zinc-600 disabled:opacity-50'
                >
                  Stop Bidding
                </button>
              </>
            )}
            {state === 'ended' && (
              <div className='flex flex-col items-end gap-2'>
                <p className='text-sm text-primary/60'>Session has ended</p>
                <div className='flex gap-2'>
                  <button
                    onClick={handlePause}
                    disabled={isPending}
                    className='bg-zinc-700 text-primary px-6 py-3 font-semibold transition hover:bg-zinc-600 disabled:opacity-50'
                  >
                    Stop Bidding
                  </button>
                  <button
                    onClick={handleStart}
                    disabled={isPending}
                    className=' bg-primary px-6 py-3 font-semibold text-black transition cursor-pointer hover:bg-primary disabled:opacity-50'
                  >
                    Restart Bidding
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className='mb-4 text-xl font-semibold'>Items</h2>
      <div className='space-y-3'>
        {items.map((item) => {
          const top = highest.get(item.id)
          return (
            <div
              key={item.id}
              className='flex items-center justify-between  border border-primary text-primary bg-background p-4'
            >
              <div>
                <p className='font-medium'>{item.name}</p>
                <p className='text-sm text-primary/50'>
                  Starting: {formatNaira(item.startingBid)}
                </p>
              </div>
              <div className='text-right'>
                {top ? (
                  <>
                    <p className='font-semibold text-primary'>
                      {formatNaira(top.amount)}
                    </p>
                    <p className='text-sm text-primary/60'>{top.bidder_name}</p>
                  </>
                ) : (
                  <p className='text-sm text-black'>No bids</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
