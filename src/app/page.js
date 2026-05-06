import Image from 'next/image'
import Link from 'next/link'
import LandingScene from '@/components/landing/LandingScene'
import { auctionMeta } from '@/data/items'

export default function Home() {
  return (
    <main className='relative h-dvh w-screen overflow-hidden bg-background text-zinc-900'>
      <LandingScene />

      <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-6 pb-12 pt-8 sm:px-10 sm:pb-16 sm:pt-12'>
        <Image
          src='/logo.png'
          alt={auctionMeta.title}
          width={280}
          height={280}
          priority
          className='pointer-events-auto h-40 w-40 sm:h-56 sm:w-56'
        />

        <div className='pointer-events-auto flex flex-col items-center gap-6 text-center sm:gap-8'>
          <div>
            {/* <p className='text-sm font-geist font-nabla text-zinc-700 sm:text-base'>
              May the odds be ever in your favor!
            </p> */}
            <p className='mt-1 text-xs uppercase font-nabla tracking-widest text-zinc-800 sm:text-sm'>
              {auctionMeta.note}
            </p>
          </div>

          <Link
            href='/auction'
            className=' border-[0.5] px-10 py-4 text-base font-nabla font-semibold text-primary shadow-2xl shadow-black/20 transition hover:bg-zinc-800 active:scale-95 sm:text-lg'
          >
            Enter Auction
          </Link>
        </div>
      </div>

      <p className='cursoor-pointer absolute bottom-4 w-full text-center text-[8px] text-black/80 sm:bottom-6'> 
        designed and developed by <a href='https://www.instagram.com/raytheboffin/' className='underline text-primary' target='_blank' rel='noopener noreferrer'>
          raytheboffin
        </a>
      </p>
    </main>
  )
}
