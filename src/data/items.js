export const auctionMeta = {
  title: 'PUSH: A GS Exhibition',
  photographer: 'Dan Ogbogu',
  period: '2022 — 2025',
  note: 'All items listed are one of one.'
}

const A1_DESC =
  'A1 print, 23.4 × 33.1 inches. Printed on card and laminated. Photographed by Dan Ogbogu.'

const A2_DESC =
  'A2 print, 16.5 × 23.4 inches. Flex print wrapped around a wooden frame. Photographed by Dan Ogbogu.'

export const items = [
  // ─── A1 Prints (2) ─────────────────────────────────
  // {
  //   id: 'a1-crew',
  //   name: 'Crew',
  //   description: A1_DESC,
  //   category: 'A1 Print',
  //   image: '/auction/a1/Crew.jpg',
  //   startingBid: 150000,
  //   isActive: true
  // },
  // {
  //   id: 'a1-crew-2',
  //   name: 'Crew II',
  //   description: A1_DESC,
  //   category: 'A1 Print',
  //   image: '/auction/a1/crew2.jpg',
  //   startingBid: 150000,
  //   isActive: true
  // },

  // ─── A2 Prints (9) ─────────────────────────────────
  // {
  //   id: 'a2-ailrang',
  //   name: 'Ailrang',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/Ailrang.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-giles',
  //   name: 'Giles',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/Giles.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-giles-2',
  //   name: 'Giles II',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/Giles2.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-giles-3',
  //   name: 'Giles III',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/giles3.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-giles-longexp',
  //   name: 'Giles (Long Exposure)',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/GilesLongexp.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-kemi',
  //   name: 'Kemi',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/Kemi.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-lukman',
  //   name: 'Lukman',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/Lukman.jpg',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-lukman-wallride',
  //   name: 'Lukman (Wallride)',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/LukmanWallride.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },
  // {
  //   id: 'a2-mohammed',
  //   name: 'Mohammed',
  //   description: A2_DESC,
  //   category: 'A2 Print',
  //   image: '/auction/a2/Mohammed.JPG',
  //   startingBid: 50000,
  //   isActive: true
  // },

  // ─── Skateboard Decks (2) ──────────────────────────
  // {
  //   id: 'deck-fahd',
  //   name: 'Skateboard Deck — Fahd Balogun',
  //   description:
  //     '8.5 inch Canadian maple skateboard deck. Original artwork by Fahd Balogun, marker on holographic print. One of one.',
  //   category: 'Skateboard Deck',
  //   image: '/auction/skate one of one .jpg',
  //   startingBid: 150000,
  //   isActive: true
  // },
  // {
  //   id: 'deck-twin',
  //   name: 'Twin Decks',
  //   description:
  //     'Pair of 8.5 inch Canadian maple skateboard decks with image printed on the back. One of one.',
  //   category: 'Skateboard Deck',
  //   image: '/auction/twin_skate.PNG',
  //   startingBid: 200000,
  //   isActive: true
  // }
]

export const getItemById = (id) => items.find((item) => item.id === id)

export const getActiveItems = () => items.filter((item) => item.isActive)
