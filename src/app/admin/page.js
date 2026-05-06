import { isAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/admin/LoginForm'
import AdminPanel from '@/components/admin/AdminPanel'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authed = await isAdmin()

  if (!authed) {
    return (
      <main className='flex min-h-dvh items-center justify-center bg-black p-6 text-primary'>
        <LoginForm />
      </main>
    )
  }

  const supabase = await createClient()

  const { data: session } = await supabase
    .from('auction_session')
    .select('*')
    .limit(1)
    .single()

  const { data: bids } = await supabase
    .from('bids')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className='min-h-dvh bg-black text-primary'>
      <AdminPanel initialSession={session} initialBids={bids ?? []} />
    </main>
  )
}
