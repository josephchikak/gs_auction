'use client'

import { useMemo } from 'react'
import { items } from '@/data/items'
import { buildHighestBidMap } from '@/lib/auction/session'
import ItemCard from './ItemCard'

export default function AuctionGrid({ bids }) {
  const highest = useMemo(() => buildHighestBidMap(bids), [bids])

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          highestBid={highest.get(item.id)}
        />
      ))}
    </div>
  )
}
