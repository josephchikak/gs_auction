'use client'

const formatHMS = (ms) => {
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function CountdownTimer({ remaining }) {
  if (remaining === null || remaining === undefined) return null

  return (
    <div className='flex flex-col items-center'>
      <span className='text-xs uppercase tracking-widest text-zinc-600'>
        Time remaining
      </span>
      <span className='mt-1 font-mono text-3xl font-bold tabular-nums text-primary sm:text-4xl'>
        {formatHMS(remaining)}
      </span>
    </div>
  )
}
