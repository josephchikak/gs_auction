import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auctionMeta } from '@/data/items'
import { getBidderId } from '@/lib/auth/bidder'
import RegisterForm from '@/components/auction/RegisterForm'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  if (await getBidderId()) redirect('/auction')

  return (
    <main className='flex min-h-dvh items-center justify-center px-6 py-12'>
      <div className='w-full max-w-md'>
        <header className='mb-8 flex flex-col items-center text-center'>
          <Image
            src='/logo.png'
            alt={auctionMeta.title}
            width={160}
            height={160}
            priority
            className='h-24 w-24 sm:h-28 sm:w-28'
          />
          <h1 className='mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl'>
            {auctionMeta.title}
          </h1>
          <p className='mt-2 text-sm text-zinc-700'>
            Enter your details to start bidding
          </p>
          <p className='mt-1 text-xs uppercase tracking-widest text-zinc-500'>
            {auctionMeta.note}
          </p>
        </header>
        <RegisterForm />
      </div>
    </main>
  )
}
