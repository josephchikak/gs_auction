export const isAcceptedPurchase = (order) => order.status === 'accepted'

export const isPendingPurchase = (order) => order.status === 'pending'

export const buildAcceptedPurchaseMap = (orders) => {
  const map = new Map()
  for (const order of orders) {
    if (!isAcceptedPurchase(order)) continue

    const current = map.get(order.item_id)
    if (!current || Number(order.amount) > Number(current.amount)) {
      map.set(order.item_id, order)
    }
  }
  return map
}

export const buildPendingPurchaseMap = (orders) => {
  const map = new Map()
  for (const order of orders) {
    if (!isPendingPurchase(order)) continue

    const current = map.get(order.item_id) ?? []
    map.set(order.item_id, [...current, order])
  }
  return map
}

export const formatNaira = (amount) =>
  `₦${Number(amount).toLocaleString('en-NG')}`
