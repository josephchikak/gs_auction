import Link from 'next/link'
import { formatNaira } from '@/lib/auction/session'

export default function ItemCard({ item, acceptedOrder }) {
  const isSold = Boolean(acceptedOrder)

  return (
    <Link
      href={`/auction/${item.id}`}
      className={`group flex flex-col overflow-hidden border bg-white/40 backdrop-blur transition hover:shadow-lg active:scale-[0.99] ${
        isSold
          ? 'border-red-700/40 opacity-75'
          : 'border-zinc-900/15 hover:border-zinc-900/40'
      }`}
    >
      <div className='relative aspect-square overflow-hidden bg-zinc-900/5'>
        <img
          src={item.image}
          alt={item.name}
          className='absolute inset-0 h-full w-full object-cover transition group-hover:scale-105'
        />
        {isSold && (
          <div className='absolute inset-x-3 top-3 bg-red-700 px-3 py-2 text-center text-xs font-bold uppercase tracking-widest text-white'>
            Sold
          </div>
        )}
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
          {isSold ? (
            <>
              <p className='text-xs uppercase tracking-widest text-zinc-500'>
                Sold for
              </p>
              <p className='text-xl font-bold text-primary'>
                {formatNaira(acceptedOrder.amount)}
              </p>
              <p className='text-xs text-zinc-600'>Order accepted</p>
            </>
          ) : (
            <>
              <p className='text-xs uppercase tracking-widest text-zinc-500'>
                Price
              </p>
              <p className='text-xl font-bold text-primary'>
                {formatNaira(item.startingBid)}
              </p>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
