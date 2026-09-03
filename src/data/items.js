export const auctionMeta = {
  title: 'PUSH: A GS Exhibition',
  photographer: 'Dan Ogbogu',
  period: '2022 — 2025',
  note: 'All items listed are one of one.'
}

const A1_DESC =
  'A1 print, 23.4 × 33.1 inches. Photographed by Dan Ogbogu. Available in A2 on demand.'

export const items = [
  // ─── A1 Prints (2) ─────────────────────────────────
  {
    id: 'a1-crew',
    name: 'Crew',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a1/Crew.jpg',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-crew-2',
    name: 'Crew II',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a1/crew2.jpg',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-ailrang',
    name: 'Ailrang',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/Ailrang.JPG',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-giles',
    name: 'Giles',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/Giles.JPG',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-giles-2',
    name: 'Giles II',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/Giles2.JPG',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-giles-3',
    name: 'Giles III',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/giles3.JPG',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-giles-longexp',
    name: 'Giles (Long Exposure)',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/GilesLongexp.JPG',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-kemi',
    name: 'Kemi',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/Kemi.JPG',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-lukman',
    name: 'Lukman',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/Lukman.jpg',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-lukman-wallride',
    name: 'Lukman (Wallride)',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/LukmanWallride.JPG',
    startingBid: 400000,
    isActive: true
  },
  {
    id: 'a1-mohammed',
    name: 'Mohammed',
    description: A1_DESC,
    category: 'A1 Print',
    image: '/auction/a2/Mohammed.JPG',
    startingBid: 400000,
    isActive: true
  },

  // ─── Skateboard Decks (2) ──────────────────────────
  {
    id: 'deck-fahd',
    name: 'Skateboard Deck — Fahd Balogun',
    description:
      '8.5 inch Canadian maple skateboard deck. Original artwork by Fahd Balogun, marker on holographic print. One of one.',
    category: 'Skateboard Deck',
    image: '/auction/skate one of one .jpg',
    startingBid: 150000,
    isActive: true
  },
  {
    id: 'deck-twin',
    name: 'Twin Decks',
    description:
      'Pair of 8.5 inch Canadian maple skateboard decks with image printed on the back. One of one.',
    category: 'Skateboard Deck',
    image: '/auction/twin_skate.PNG',
    startingBid: 200000,
    isActive: true
  }
]

export const getItemById = (id) => items.find((item) => item.id === id)

export const getActiveItems = () => items.filter((item) => item.isActive)
