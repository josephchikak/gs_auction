'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { registerBidder, requestPurchase } from '@/lib/actions/bidder'

const initialState = { error: null, success: false }

export default function RegisterForm({ item }) {
  const router = useRouter()
  const action = item ? requestPurchase : registerBidder
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  )

  useEffect(() => {
    if (state.success && state.itemId) {
      router.push(`/auction/${state.itemId}`)
    }
  }, [router, state.itemId, state.success])

  return (
    <form action={formAction} className='flex flex-col gap-4'>
      {item && (
        <input type='hidden' name='purchaseItemId' value={item.id} />
      )}
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
      {state.success && item && (
        <p className='text-sm text-emerald-700'>
          Details received. Redirecting to the piece now.
        </p>
      )}
      <button
        type='submit'
        disabled={isPending || state.success}
        className='bg-zinc-900 px-8 py-3 font-semibold text-primary transition hover:bg-zinc-800 active:scale-95 disabled:opacity-50'
      >
        {isPending
          ? 'Saving…'
          : item
            ? 'Submit purchase request'
            : 'Continue'}
      </button>
    </form>
  )
}
