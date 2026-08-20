import { isAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/admin/LoginForm'
import AdminPanel from '@/components/admin/AdminPanel'
import ProductForm from '@/components/admin/ProductForm'
import { getAuctionItems } from '@/lib/auction/items'

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

  const { data: bids } = await supabase
    .from('bids')
    .select('*')
    .order('created_at', { ascending: false })

  const auctionItems = await getAuctionItems()

  return (
    <main className='min-h-dvh bg-black text-primary'>
      <div className='mx-auto max-w-5xl p-6'>
        <ProductForm />
      </div>
      <AdminPanel initialBids={bids ?? []} items={auctionItems} />
    </main>
  )
}
