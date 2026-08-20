import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auctionMeta } from '@/data/items'
import { getAuctionItemById } from '@/lib/auction/items'
import { createClient } from '@/lib/supabase/server'
import { getBidderId } from '@/lib/auth/bidder'
import RegisterForm from '@/components/auction/RegisterForm'
import { formatNaira } from '@/lib/auction/session'

export const dynamic = 'force-dynamic'

export default async function RegisterPage({ searchParams }) {
  const query = await searchParams
  const itemId = query?.itemId?.toString()
  const item = itemId ? await getAuctionItemById(itemId) : null

  if (!itemId && await getBidderId()) redirect('/auction')

  let isSold = false
  if (item) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('bids')
      .select('id')
      .eq('item_id', item.id)
      .eq('status', 'accepted')
      .limit(1)
      .maybeSingle()

    isSold = Boolean(data)
  }

  return (
    <main className='flex min-h-dvh items-center justify-center px-6 py-12'>
      <div className='w-full max-w-md'>
        <header className='mb-8 flex flex-col items-center text-center'>
          <Link href='/' aria-label='Home'>
            <Image
              src='/logo.png'
              alt={auctionMeta.title}
              width={160}
              height={160}
              priority
              className='h-24 w-24 sm:h-28 sm:w-28'
            />
          </Link>
          <h1 className='mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl'>
            {auctionMeta.title}
          </h1>
          <p className='mt-2 text-sm text-zinc-700'>
            {item
              ? `Enter your details for ${item.name}`
              : 'Enter your details'}
          </p>
          <p className='mt-1 text-xs uppercase tracking-widest text-zinc-500'>
            {auctionMeta.note}
          </p>
        </header>
        {item && (
          <div className='mb-6 border border-zinc-900/15 bg-white/40 p-4 text-center'>
            <p className='text-sm font-semibold text-zinc-900'>{item.name}</p>
            <p className='mt-1 text-sm text-primary'>{formatNaira(item.startingBid)}</p>
          </div>
        )}
        {isSold ? (
          <div className='text-center'>
            <p className='text-sm text-zinc-700'>
              An order has been accepted for this one-of-one piece, so it is no longer available.
            </p>
            <Link
              href='/auction'
              className='mt-6 inline-flex bg-zinc-900 px-8 py-3 font-semibold text-primary transition hover:bg-zinc-800 active:scale-95'
            >
              View available pieces
            </Link>
          </div>
        ) : (
          <RegisterForm item={item} />
        )}
      </div>
    </main>
  )
}
