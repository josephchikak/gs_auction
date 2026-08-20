'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { createItem } from '@/lib/actions/admin'

const initialState = { error: null, success: false }

export default function ProductForm() {
  const [state, formAction, isPending] = useActionState(createItem, initialState)
  const formRef = useRef(null)
  const [fileName, setFileName] = useState('No image selected')

  const handleFileChange = (event) => {
    setFileName(event.target.files?.[0]?.name ?? 'No image selected')
  }

  useEffect(() => {
    if (!state.success) return
    formRef.current?.reset()
  }, [state.success])

  return (
    <form
      ref={formRef}
      action={formAction}
      className='mb-8 grid gap-4 border border-white/10 bg-background p-6 sm:grid-cols-2'
    >
      <div className='sm:col-span-2'>
        <p className='text-sm uppercase tracking-wide text-primary'>Add product</p>
        <p className='mt-1 text-sm text-primary/70'>New products appear in the auction after you submit them.</p>
      </div>
      <input name='name' placeholder='Product name' required className='border border-white/10 bg-black px-4 py-3 text-primary outline-none focus:border-white/30' />
      <div className='flex items-center gap-3 border border-white/10 bg-black px-4 py-2'>
        <label htmlFor='product-image' className='cursor-pointer bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/90'>
          Choose image
        </label>
        <input
          id='product-image'
          name='image'
          type='file'
          accept='image/jpeg,image/png,image/webp,image/gif'
          required
          onChange={handleFileChange}
          className='sr-only'
        />
        <span className='min-w-0 truncate text-sm text-primary/70'>{fileName}</span>
      </div>
      <input name='price' type='number' min='0' step='1' placeholder='Price (NGN)' required className='border border-white/10 bg-black px-4 py-3 text-primary outline-none focus:border-white/30' />
      <textarea name='description' placeholder='Description' required rows='3' className='border border-white/10 bg-black px-4 py-3 text-primary outline-none focus:border-white/30 sm:col-span-2' />
      {state.error && <p className='text-sm text-red-400 sm:col-span-2'>{state.error}</p>}
      {state.success && <p className='text-sm text-emerald-400 sm:col-span-2'>Product added successfully.</p>}
      <button type='submit' disabled={isPending} className='bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50 sm:col-span-2'>
        {isPending ? 'Adding product...' : 'Add product'}
      </button>
    </form>
  )
}
