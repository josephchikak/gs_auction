'use client'

import { useActionState } from 'react'
import { adminLogin } from '@/lib/actions/admin'

const initialState = { error: null }

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, initialState)

  return (
    <form
      action={formAction}
      className='flex w-full max-w-sm flex-col gap-4  border border-white/10 bg-white/5 p-8'
    >
      <h1 className='text-2xl font-bold'>Admin login</h1>
      <input
        type='password'
        name='password'
        placeholder='Password'
        required
        autoFocus
        className=' border border-white/10 bg-black px-4 py-3 text-primary outline-none focus:border-white/30'
      />
      {state?.error && (
        <p className='text-sm text-red-400'>{state.error}</p>
      )}
      <button
        type='submit'
        disabled={isPending}
        className=' bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50'
      >
        {isPending ? 'Logging in…' : 'Login'}
      </button>
    </form>
  )
}
