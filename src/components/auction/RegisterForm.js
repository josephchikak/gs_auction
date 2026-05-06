'use client'

import { useActionState } from 'react'
import { registerBidder } from '@/lib/actions/bidder'

const initialState = { error: null, success: false }

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerBidder,
    initialState
  )

  return (
    <form action={formAction} className='flex flex-col gap-4'>
      <input
        type='text'
        name='name'
        placeholder='Full name'
        required
        autoFocus
        className='border border-zinc-900/20 bg-white/60 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900/50'
      />
      <input
        type='email'
        name='email'
        placeholder='Email'
        required
        className='border border-zinc-900/20 bg-white/60 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900/50'
      />
      <input
        type='tel'
        name='phone'
        placeholder='Phone number'
        required
        className='border border-zinc-900/20 bg-white/60 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900/50'
      />
      {state.error && (
        <p className='text-sm text-red-700'>{state.error}</p>
      )}
      <button
        type='submit'
        disabled={isPending}
        className='bg-zinc-900 px-8 py-3 font-semibold text-primary transition hover:bg-zinc-800 active:scale-95 disabled:opacity-50'
      >
        {isPending ? 'Saving…' : 'Continue to Auction'}
      </button>
    </form>
  )
}
