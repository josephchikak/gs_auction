# Pending order visibility fix

- [x] Render every pending bid independently of catalogue membership
- [x] Preserve original item IDs and amounts for historical orders
- [x] Keep order state current after server actions and realtime events
- [x] Run lint, build and regression checks

## Review
Added a catalogue-independent pending-order list with original item IDs, stored amounts, buyer details and dates. Realtime events refresh server data; server action revalidation is no longer masked by stale local state. No database records changed.

Verification: production build passed; lint passed with three existing image warnings. Render regression check reproduced hidden historical orders in the original component and verified all pending buyers, original IDs/amounts, empty state and visibility of requests for sold items in the updated component.
