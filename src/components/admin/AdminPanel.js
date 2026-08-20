'use client'

import { useState, useEffect, useTransition, useMemo } from 'react'
import { adminLogout } from '@/lib/actions/admin'
import { deleteItem } from '@/lib/actions/admin'
import { acceptPurchase, resetPurchase } from '@/lib/actions/orders'
import { createClient } from '@/lib/supabase/client'
import {
  buildAcceptedPurchaseMap,
  buildPendingPurchaseMap,
  formatNaira
} from '@/lib/auction/session'

export default function AdminPanel({ initialBids, items }) {
  const [bids, setBids] = useState(initialBids)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('admin-sales-realtime')
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

  const sold = useMemo(() => buildAcceptedPurchaseMap(bids), [bids])
  const pending = useMemo(() => buildPendingPurchaseMap(bids), [bids])
  const soldCount = sold.size
  const pendingCount = bids.filter((bid) => bid.status === 'pending').length

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
            <p className='text-sm uppercase tracking-wide text-primary'>Sales</p>
            <p className='mt-1 text-2xl font-semibold'>
              {soldCount} of {items.length} sold
            </p>
            <p className='mt-2 text-sm text-primary/70'>
              {pendingCount} order request{pendingCount === 1 ? '' : 's'} waiting for acceptance.
            </p>
          </div>
        </div>
      </div>

      <h2 className='mb-4 text-xl font-semibold'>Items</h2>
      <div className='space-y-3'>
        {items.map((item) => {
          const top = sold.get(item.id)
          const pendingOrders = pending.get(item.id) ?? []
          return (
            <div
              key={item.id}
              className='border border-primary text-primary bg-background p-4'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>{item.name}</p>
                  {item.isCustom && (
                    <form action={deleteItem} className='mt-2'>
                      <input type='hidden' name='itemId' value={item.id} />
                      <button
                        type='submit'
                        className='text-xs text-red-400 transition hover:text-red-300'
                      >
                        Delete product
                      </button>
                    </form>
                  )}
                </div>
                <div className='text-right'>
                  {top ? (
                    <>
                      <p className='text-xs uppercase tracking-widest text-primary/50'>Accepted</p>
                      <p className='font-semibold text-primary'>
                        {formatNaira(top.amount)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className='text-xs uppercase tracking-widest text-primary/50'>
                        {pendingOrders.length > 0 ? 'Pending' : 'Available'}
                      </p>
                      <p className='font-semibold text-primary'>
                        {formatNaira(item.startingBid)}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {top && (
                <div className='mt-3 border-t border-primary/20 pt-3 grid grid-cols-3 gap-2 text-sm'>
                  <div>
                    <p className='text-xs uppercase tracking-widest text-primary/50'>Buyer</p>
                    <p className='font-medium'>{top.bidder_name}</p>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-widest text-primary/50'>Email</p>
                    <p className='font-medium'>{top.bidder_email}</p>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-widest text-primary/50'>Phone</p>
                    <p className='font-medium'>{top.bidder_phone}</p>
                  </div>
                  <form action={resetPurchase} className='col-span-3 mt-2'>
                    <input type='hidden' name='orderId' value={top.id} />
                    <input type='hidden' name='itemId' value={item.id} />
                    <button
                      type='submit'
                      className='border border-amber-400/50 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/10'
                    >
                      Reset accepted order
                    </button>
                  </form>
                </div>
              )}
              {!top && pendingOrders.length > 0 && (
                <div className='mt-3 space-y-3 border-t border-primary/20 pt-3'>
                  {pendingOrders.map((order) => (
                    <div
                      key={order.id}
                      className='grid gap-3 text-sm sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end'
                    >
                      <div>
                        <p className='text-xs uppercase tracking-widest text-primary/50'>Pending buyer</p>
                        <p className='font-medium'>{order.bidder_name}</p>
                      </div>
                      <div>
                        <p className='text-xs uppercase tracking-widest text-primary/50'>Email</p>
                        <p className='font-medium'>{order.bidder_email}</p>
                      </div>
                      <div>
                        <p className='text-xs uppercase tracking-widest text-primary/50'>Phone</p>
                        <p className='font-medium'>{order.bidder_phone}</p>
                      </div>
                      <form action={acceptPurchase}>
                        <input type='hidden' name='orderId' value={order.id} />
                        <input type='hidden' name='itemId' value={item.id} />
                        <button
                          type='submit'
                          className='bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400'
                        >
                          Accept order
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
