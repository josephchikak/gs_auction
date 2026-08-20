'use client'

import { useMemo } from 'react'
import { buildAcceptedPurchaseMap } from '@/lib/auction/session'
import ItemCard from './ItemCard'

export default function AuctionGrid({ bids, items }) {
  const accepted = useMemo(() => buildAcceptedPurchaseMap(bids), [bids])

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          acceptedOrder={accepted.get(item.id)}
        />
      ))}
    </div>
  )
}
