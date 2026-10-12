/**
 * Doraemon Gadgets - Product Database
 * 
 * To add a new product:
 * 1. Put product photos into `public/products/` (e.g. `public/products/my-gadget-1.jpg`)
 * 2. Add a new product object to the top of the `products` array below.
 * That's it! No code or component changes needed.
 */

export const products = [
  {
    id: "levitating-moon-lamp",
    name: "Levitating 3D Moonlight Lamp",
    tagline: "Defies gravity with soft 3D magnetic levitation & touch controls",
    description: "Bring celestial magic right onto your desk or bedside table. This 3D-textured moon floats effortlessly in mid-air using magnetic levitation technology, spinning silently while casting calming warm and cool ambient light.",
    highlights: [
      "True magnetic levitation with smooth 360° auto-rotation",
      "3 touch-dimmable light modes (Warm Amber, Lunar White, Golden Hour)",
      "Wireless induction power — no cords or batteries attached to the moon",
      "Auto-catch drop protection safety feature when powered off"
    ],
    category: "Home & Decor",
    images: [
      "/products/levitating-moon-lamp-1.jpg",
      "/products/levitating-moon-lamp-2.jpg"
    ],
    dateAdded: "2026-10-11",
    links: [
      { store: "Amazon", url: "https://www.amazon.in/dp/B08XYZ1234?tag=doraemongadgets-21", price: "₹2,499" },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=levitating+moon+lamp&affid=doraemon", price: "₹2,649" },
      { store: "Meesho", url: "https://www.meesho.com/search?q=moon+lamp+magnetic", price: "₹2,299" }
    ]
  },
  {
    id: "magsafe-pocket-powerbank",
    name: "Ultra-Slim MagSafe Titanium Power Bank",
    tagline: "10,000mAh magnetic snap-on battery with built-in folding kickstand",
    description: "Never carry messy cables again. This aircraft-grade aluminum battery pack magnetically locks onto the back of your phone, delivers rapid 15W wireless juice, and unfolds into a sturdy hands-free media stand.",
    highlights: [
      "15W MagSafe fast wireless charging + 20W PD Type-C bidirectional port",
      "Slim 13mm aerodynamic profile that doesn't block phone cameras",
      "Dual-angle aerospace zinc kickstand for portrait FaceTime & landscape reels",
      "Intelligent LED real-time battery % display with heat-shield technology"
    ],
    category: "Tech & Mobile",
    images: [
      "/products/magsafe-pocket-powerbank-1.jpg",
      "/products/magsafe-pocket-powerbank-2.jpg"
    ],
    dateAdded: "2026-10-09",
    links: [
      { store: "Amazon", url: "https://www.amazon.in/dp/B09MAGSAFE?tag=doraemongadgets-21", price: "₹1,799" },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=magsafe+powerbank&affid=doraemon", price: "₹1,899" },
      { store: "Tata CLiQ", url: "https://www.tatacliq.com/search/?searchCategory=all&text=magsafe+powerbank", price: "₹1,999" }
    ]
  },
  {
    id: "mini-thermal-label-printer",
    name: "Inkless Pocket Thermal Label Printer",
    tagline: "Bluetooth thermal printer for spice jars, cables, and aesthetic journal notes",
    description: "The viral pocket companion for hyper-organized living. Prints high-resolution custom stickers, jar labels, to-do memos, and barcode labels in seconds straight from your smartphone without ever needing ink, toner, or messy ribbons.",
    highlights: [
      "100% inkless direct thermal printing — never pay for replacement ink",
      "Instant Bluetooth 5.0 sync with iOS & Android companion apps",
      "Over 600+ free customizable templates, cute fonts, and emoji icons",
      "Compact 160g pocket size with 1200mAh USB-C rechargeable battery"
    ],
    category: "Productivity",
    images: [
      "/products/mini-thermal-label-printer-1.jpg",
      "/products/mini-thermal-label-printer-2.jpg"
    ],
    dateAdded: "2026-10-04",
    links: [
      { store: "Amazon", url: "https://www.amazon.in/dp/B08PRINTER?tag=doraemongadgets-21", price: "₹1,299" },
      { store: "Meesho", url: "https://www.meesho.com/search?q=mini+label+printer", price: "₹1,149" },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=thermal+label+printer&affid=doraemon", price: "₹1,349" }
    ]
  },
  {
    id: "handheld-electric-chopper",
    name: "4-in-1 Handheld Electric Veggie Chopper",
    tagline: "Slice, mince, peel and scrub veggies directly into your pan with zero mess",
    description: "Featured in millions of viral cooking reels, this cordless kitchen multitool eliminates the cutting board. Feed garlic, chilies, carrots, or ginger into the top port and watch perfectly sliced ingredients fall straight into your frying pan.",
    highlights: [
      "Direct open-feed port — no stopping to empty messy containers",
      "Includes interchangeable slicing disc, mincing cup, and power cleaning brush",
      "High-torque 40W copper motor with food-grade 304 stainless steel blades",
      "One-key waterproof self-cleaning: just add dish soap and press start"
    ],
    category: "Kitchen",
    images: [
      "/products/handheld-electric-chopper-1.jpg",
      "/products/handheld-electric-chopper-2.jpg"
    ],
    dateAdded: "2026-09-18",
    links: [
      { store: "Amazon", url: "https://www.amazon.in/dp/B09CHOPPER?tag=doraemongadgets-21", price: "₹699" },
      { store: "Meesho", url: "https://www.meesho.com/search?q=electric+chopper+4+in+1", price: "₹579" },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=handheld+vegetable+chopper&affid=doraemon", price: "₹749" }
    ]
  },
  {
    id: "flame-mist-aroma-diffuser",
    name: "Realistic Flame Mist Aroma Diffuser",
    tagline: "Cozy fireplace vibe with whisper-silent ultrasonic essential oil mist",
    description: "Turn your room into an ultra-cozy chill zone. By combining smart warm LED lighting with cold ultrasonic humidifying mist, this diffuser creates a shockingly realistic fire flame aesthetic that is 100% cool and completely safe to touch.",
    highlights: [
      "Ultra-realistic optical flame effect in warm fire amber & ice cyan modes",
      "Whisper-quiet 20dB ultrasonic diffusion ideal for deep sleep & focus work",
      "Smart auto shut-off safety when the water tank empties",
      "Aromatherapy-ready: add 2-3 drops of essential oils for hours of calm aroma"
    ],
    category: "Home & Decor",
    images: [
      "/products/flame-mist-aroma-diffuser-1.jpg",
      "/products/flame-mist-aroma-diffuser-2.jpg"
    ],
    dateAdded: "2026-09-08",
    links: [
      { store: "Amazon", url: "https://www.amazon.in/dp/B09DIFFUSER?tag=doraemongadgets-21", price: "₹1,099" },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=flame+diffuser&affid=doraemon", price: "₹1,199" },
      { store: "Myntra", url: "https://www.myntra.com/flame-diffuser", price: "₹1,249" }
    ]
  },
  {
    id: "smart-temp-coffee-mug",
    name: "Smart Temperature Control Heated Mug",
    tagline: "Keeps your morning brew at the exact perfect warmth for 3+ hours",
    description: "Never drink lukewarm coffee or cold chai again. Set your favorite temperature between 45°C and 65°C on the touch base, and the precision micro-thermal sensors keep every single sip at the exact ideal temperature all morning.",
    highlights: [
      "Precision touch temperature adjustment between 45°C and 65°C",
      "Anti-scratch food-grade ceramic inner lining with spill-resistant slide lid",
      "Wireless charging coaster maintains all-day warmth while seated at desk",
      "Auto-sleep motion sensor enters standby when empty and wakes upon lifting"
    ],
    category: "Smart Living",
    images: [
      "/products/smart-temp-coffee-mug-1.jpg",
      "/products/smart-temp-coffee-mug-2.jpg"
    ],
    dateAdded: "2026-08-25",
    links: [
      { store: "Amazon", url: "https://www.amazon.in/dp/B08HEATEDMUG?tag=doraemongadgets-21", price: "₹3,499" },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=smart+heated+mug&affid=doraemon", price: "₹3,699" },
      { store: "Tata CLiQ", url: "https://www.tatacliq.com/search/?text=smart+mug", price: "₹3,599" }
    ]
  }
];

export default products;
