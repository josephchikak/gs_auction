import Image from 'next/image'
import Link from 'next/link'
import { formatNaira } from '@/lib/auction/session'

export default function ItemCard({ item, highestBid }) {
  return (
    <Link
      href={`/auction/${item.id}`}
      className='group flex flex-col overflow-hidden border border-zinc-900/15 bg-white/40 backdrop-blur transition hover:border-zinc-900/40 hover:shadow-lg active:scale-[0.99]'
    >
      <div className='relative aspect-square overflow-hidden bg-zinc-900/5'>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          className='object-cover transition group-hover:scale-105'
        />
      </div>

      <div className='flex flex-col gap-2 p-4'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <p className='text-xs uppercase tracking-widest text-zinc-500'>
              {item.category}
            </p>
            <h3 className='text-lg font-semibold text-zinc-900'>
              {item.name}
            </h3>
          </div>
        </div>

        <div className='mt-1 border-t border-zinc-900/10 pt-3'>
          {highestBid ? (
            <>
              <p className='text-xs uppercase tracking-widest text-zinc-500'>
                Highest bid
              </p>
              <p className='text-xl font-bold text-primary'>
                {formatNaira(highestBid.amount)}
              </p>
              <p className='text-xs text-zinc-600'>by {highestBid.bidder_name}</p>
            </>
          ) : (
            <p className='text-sm text-zinc-500'>No bids yet</p>
          )}
        </div>
      </div>
    </Link>
  )
}
