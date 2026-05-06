export const getSessionState = (session, now = Date.now()) => {
  if (!session?.started_at) return 'not_started'
  if (session.ended_manually) return 'ended'
  const endsAt = new Date(session.started_at).getTime() + session.duration_minutes * 60 * 1000
  return now < endsAt ? 'active' : 'ended'
}

export const getRemainingMs = (session, now = Date.now()) => {
  if (!session?.started_at) return null
  const endsAt = new Date(session.started_at).getTime() + session.duration_minutes * 60 * 1000
  return Math.max(0, endsAt - now)
}

export const buildHighestBidMap = (bids) => {
  const map = new Map()
  for (const bid of bids) {
    const current = map.get(bid.item_id)
    if (!current || Number(bid.amount) > Number(current.amount)) {
      map.set(bid.item_id, bid)
    }
  }
  return map
}

export const formatNaira = (amount) =>
  `₦${Number(amount).toLocaleString('en-NG')}`
