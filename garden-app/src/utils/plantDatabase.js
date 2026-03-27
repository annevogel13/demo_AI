// Curated database of common vegetables, herbs and fruits.
// daysToMaturity: typical days from seed to harvest
// wateringInterval: suggested days between watering
// varieties: common variety names for the variety autocomplete

export const PLANT_DB = [
  // ── Tomatoes ─────────────────────────────────────────────
  {
    name: 'Tomato',
    emoji: '🍅',
    daysToMaturity: 75,
    daysRange: '60–85',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Start indoors 6–8 weeks before last frost. Needs warmth to germinate (21–27 °C). Transplant when 15 cm tall. Feed weekly once flowering.',
    varieties: ['Cherry Roma', 'Moneymaker', 'Brandywine', 'Black Krim', 'Sungold', 'Roma', 'Beefsteak', 'Sweet Million'],
  },
  {
    name: 'Cherry Tomato',
    emoji: '🍒',
    daysToMaturity: 65,
    daysRange: '55–70',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Prolific and fast-maturing. Great for containers. Keep soil consistently moist to prevent blossom-end rot.',
    varieties: ['Sungold', 'Sweet 100', 'Black Cherry', 'Yellow Pear', 'Gardeners Delight'],
  },

  // ── Peppers ──────────────────────────────────────────────
  {
    name: 'Bell Pepper',
    emoji: '🫑',
    daysToMaturity: 80,
    daysRange: '70–90',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Slow starters — sow 10 weeks before last frost. Need soil temps above 18 °C to germinate. Green → yellow → red as they ripen.',
    varieties: ['California Wonder', 'Yolo Wonder', 'Orange Sun', 'Purple Beauty', 'Mini Sweet'],
  },
  {
    name: 'Chilli Pepper',
    emoji: '🌶️',
    daysToMaturity: 85,
    daysRange: '70–100',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Sow early (Jan–Feb). Needs warmth and patience. Heat level increases with stress — slightly drier soil boosts capsaicin.',
    varieties: ['Cayenne', 'Jalapeño', 'Habanero', 'Bird\'s Eye', 'Serrano', 'Anaheim', 'Poblano'],
  },

  // ── Cucurbits ────────────────────────────────────────────
  {
    name: 'Cucumber',
    emoji: '🥒',
    daysToMaturity: 55,
    daysRange: '50–70',
    wateringInterval: 1,
    sun: 'Full sun',
    description: 'Direct sow after last frost or start 3 weeks early. Needs consistent moisture — irregular watering causes bitter fruit. Pick frequently.',
    varieties: ['Marketmore', 'Telegraph', 'Diva', 'Crystal Apple', 'Lemon', 'Burpless'],
  },
  {
    name: 'Courgette',
    emoji: '🥬',
    daysToMaturity: 50,
    daysRange: '45–60',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Very fast grower — harvest small (15–20 cm) for best flavour. One plant can produce abundantly. Direct sow after last frost.',
    varieties: ['Black Beauty', 'Defender', 'Patio Star', 'Yellow Crookneck', 'Tromboncino'],
  },
  {
    name: 'Pumpkin',
    emoji: '🎃',
    daysToMaturity: 100,
    daysRange: '90–120',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Needs lots of space and a long season. Start indoors 3 weeks before last frost. Feed with high-potassium fertiliser once fruits set.',
    varieties: ['Howden', 'Atlantic Giant', 'Butternut', 'Crown Prince', 'Jack-o-Lantern'],
  },
  {
    name: 'Butternut Squash',
    emoji: '🥕',
    daysToMaturity: 110,
    daysRange: '100–120',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Long season crop. Start indoors 4 weeks before last frost. Cure harvested squash at room temperature for 2 weeks to sweeten.',
    varieties: ['Waltham', 'Honey Nut', 'Butterscotch', 'Metro'],
  },

  // ── Leafy greens ─────────────────────────────────────────
  {
    name: 'Lettuce',
    emoji: '🥬',
    daysToMaturity: 45,
    daysRange: '30–60',
    wateringInterval: 1,
    sun: 'Partial shade',
    description: 'Cool-season crop. Germinates best below 20 °C. Sow successively every 2 weeks for continuous harvest. Bolt-resistant varieties for summer.',
    varieties: ['Little Gem', 'Butterhead', 'Lollo Rosso', 'Oakleaf', 'Romaine', 'Iceberg', 'Batavia'],
  },
  {
    name: 'Spinach',
    emoji: '🌿',
    daysToMaturity: 40,
    daysRange: '35–50',
    wateringInterval: 1,
    sun: 'Partial shade',
    description: 'Best in cool weather (5–18 °C). Bolts quickly in heat. Harvest outer leaves to extend the season. Excellent for containers.',
    varieties: ['Bloomsdale', 'Baby Leaf', 'Perpetual', 'Matador', 'Tyee'],
  },
  {
    name: 'Kale',
    emoji: '🥬',
    daysToMaturity: 60,
    daysRange: '55–75',
    wateringInterval: 2,
    sun: 'Full sun / partial shade',
    description: 'Hardy and cold-tolerant — flavour improves after frost. Pick outer leaves regularly. Grows well into autumn/winter.',
    varieties: ['Cavolo Nero', 'Curly Scotch', 'Red Russian', 'Redbor', 'Tuscano'],
  },
  {
    name: 'Swiss Chard',
    emoji: '🌱',
    daysToMaturity: 55,
    daysRange: '50–60',
    wateringInterval: 2,
    sun: 'Full sun / partial shade',
    description: 'Tolerates both heat and mild frost. Cut-and-come-again — harvest outer stalks. Striking coloured varieties look beautiful in pots.',
    varieties: ['Rainbow', 'Bright Lights', 'Fordhook Giant', 'Ruby Red'],
  },
  {
    name: 'Pak Choi',
    emoji: '🥬',
    daysToMaturity: 35,
    daysRange: '30–45',
    wateringInterval: 1,
    sun: 'Partial shade',
    description: 'Very fast grower. Sow direct or in modules. Prone to bolting in heat — best in spring/autumn. Keep moist for best leaves.',
    varieties: ['Joi Choi', 'Pak Choi White', 'Mini Pak Choi', 'Red Choi'],
  },

  // ── Brassicas ────────────────────────────────────────────
  {
    name: 'Broccoli',
    emoji: '🥦',
    daysToMaturity: 80,
    daysRange: '70–100',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Start indoors 6–8 weeks before transplanting. Harvest the central head before flowers open; side shoots follow. Caterpillars love it — use netting.',
    varieties: ['Calabrese', 'Tenderstem', 'Purple Sprouting', 'Romanesco', 'De Cicco'],
  },
  {
    name: 'Cauliflower',
    emoji: '🥦',
    daysToMaturity: 85,
    daysRange: '70–100',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'More demanding than broccoli. Needs consistent moisture and nutrients. Tie outer leaves over the curd to blanch and keep it white.',
    varieties: ['Snowball', 'All Year Round', 'Violetta', 'Graffiti', 'Cheddar'],
  },
  {
    name: 'Cabbage',
    emoji: '🥬',
    daysToMaturity: 90,
    daysRange: '70–120',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Start early under cover. Split heads can occur if watering is irregular after drought. Use brassica collar to deter cabbage root fly.',
    varieties: ['Hispi', 'Savoy', 'Red Drumhead', 'January King', 'Sweetheart'],
  },
  {
    name: 'Brussels Sprouts',
    emoji: '🌿',
    daysToMaturity: 120,
    daysRange: '100–150',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Long-season crop. Plant out firmly — loosely planted sprouts button rather than form tight heads. Harvest from the bottom up after first frosts.',
    varieties: ['Trafalgar', 'Cascade', 'Brodie', 'Red Ball', 'Nautic'],
  },

  // ── Root vegetables ──────────────────────────────────────
  {
    name: 'Carrot',
    emoji: '🥕',
    daysToMaturity: 70,
    daysRange: '60–80',
    wateringInterval: 3,
    sun: 'Full sun',
    description: 'Sow direct — does not like transplanting. Deep, loose, stone-free soil for straight roots. Thin to 5 cm. Keep moist for germination (can take 3 weeks).',
    varieties: ['Nantes', 'Chantenay', 'Autumn King', 'Purple Haze', 'Rainbow Mix', 'Imperator'],
  },
  {
    name: 'Beetroot',
    emoji: '🫐',
    daysToMaturity: 60,
    daysRange: '50–70',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Each "seed" is a cluster — thin to one seedling. Harvest when golf-ball size for sweetest flavour. Young leaves are edible too.',
    varieties: ['Boltardy', 'Detroit', 'Chioggia', 'Golden', 'Red Ace', 'Cylindra'],
  },
  {
    name: 'Radish',
    emoji: '🌸',
    daysToMaturity: 25,
    daysRange: '20–30',
    wateringInterval: 1,
    sun: 'Full sun / partial shade',
    description: 'Fastest vegetable in the garden. Sow direct every 2 weeks. Harvest promptly — they go woody and hot if left too long.',
    varieties: ['Cherry Belle', 'French Breakfast', 'Watermelon', 'Black Spanish', 'Daikon'],
  },
  {
    name: 'Turnip',
    emoji: '🌱',
    daysToMaturity: 45,
    daysRange: '40–60',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Cool-season crop. Direct sow. Harvest young (5–7 cm) for sweetness. Young greens also edible.',
    varieties: ['Purple Top', 'Milan', 'Golden Ball', 'Tokyo Cross'],
  },
  {
    name: 'Parsnip',
    emoji: '🌿',
    daysToMaturity: 130,
    daysRange: '120–150',
    wateringInterval: 3,
    sun: 'Full sun',
    description: 'Very slow to germinate (up to 4 weeks). Sow fresh seed in March. Flavour improves dramatically after first hard frosts.',
    varieties: ['Hollow Crown', 'Tender and True', 'Javelin', 'White Gem'],
  },
  {
    name: 'Potato',
    emoji: '🥔',
    daysToMaturity: 75,
    daysRange: '60–100',
    wateringInterval: 3,
    sun: 'Full sun',
    description: 'Chit seed potatoes for 4–6 weeks before planting. Earth up as shoots grow. Earlies ready ~10 weeks, maincrops ~18 weeks.',
    varieties: ['Charlotte', 'Maris Piper', 'Desiree', 'King Edward', 'Rooster', 'Jersey Royal'],
  },

  // ── Alliums ──────────────────────────────────────────────
  {
    name: 'Onion',
    emoji: '🧅',
    daysToMaturity: 100,
    daysRange: '90–120',
    wateringInterval: 3,
    sun: 'Full sun',
    description: 'Sow Jan–Feb indoors or use sets for easier growing. Stop watering once leaves start to topple — this triggers bulb ripening.',
    varieties: ['Sturon', 'Red Baron', 'Ailsa Craig', 'Stuttgarter', 'Walla Walla'],
  },
  {
    name: 'Spring Onion',
    emoji: '🌿',
    daysToMaturity: 60,
    daysRange: '50–70',
    wateringInterval: 2,
    sun: 'Full sun / partial shade',
    description: 'Sow direct every 3 weeks for continuous supply. Very easy — ideal for beginners and containers. Pull when pencil-thick.',
    varieties: ['White Lisbon', 'Performer', 'Red Stem', 'Ishikura'],
  },
  {
    name: 'Leek',
    emoji: '🌱',
    daysToMaturity: 130,
    daysRange: '120–150',
    wateringInterval: 3,
    sun: 'Full sun',
    description: 'Sow Jan–March. Transplant into deep dibbed holes and fill with water (not soil) to blanch stems. Frost-hardy — harvest through winter.',
    varieties: ['Musselburgh', 'Carentan', 'Blue de Solaise', 'Giant Winter'],
  },
  {
    name: 'Garlic',
    emoji: '🧄',
    daysToMaturity: 240,
    daysRange: '220–260',
    wateringInterval: 5,
    sun: 'Full sun',
    description: 'Plant cloves in autumn (Oct–Nov) for best harvest next summer. Harvest when half the leaves have yellowed. Cure in a warm dry spot.',
    varieties: ['Solent Wight', 'Elephant', 'Carcassonne Wight', 'Lautrec Wight', 'Picardy Wight'],
  },

  // ── Legumes ──────────────────────────────────────────────
  {
    name: 'French Bean',
    emoji: '🫘',
    daysToMaturity: 60,
    daysRange: '50–70',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Direct sow after last frost — beans hate cold. Pick young and regularly; leaving pods to mature slows production.',
    varieties: ['Safari', 'Cobra', 'Purple Teepee', 'Borlotti', 'Helda'],
  },
  {
    name: 'Runner Bean',
    emoji: '🫘',
    daysToMaturity: 75,
    daysRange: '65–80',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Needs support (2 m canes). Start indoors in April or direct sow in May. Mist flowers in dry weather to aid pollination.',
    varieties: ['Enorma', 'Scarlet Emperor', 'White Lady', 'Desiree', 'Painted Lady'],
  },
  {
    name: 'Broad Bean',
    emoji: '🫘',
    daysToMaturity: 90,
    daysRange: '80–100',
    wateringInterval: 3,
    sun: 'Full sun',
    description: 'Hardy — sow in Nov for overwintering or Feb–March. Pinch out growing tips once first pods set to deter blackfly.',
    varieties: ['Aquadulce Claudia', 'Imperial Green Longpod', 'The Sutton', 'Witkiem Manita'],
  },
  {
    name: 'Garden Pea',
    emoji: '🫛',
    daysToMaturity: 65,
    daysRange: '55–75',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Sow direct March–June. Provide support with twigs or netting. Pick every few days once pods fill out to keep plants cropping.',
    varieties: ['Kelvedon Wonder', 'Hurst Green Shaft', 'Sugar Snap', 'Mangetout', 'Douce Provence'],
  },

  // ── Herbs ────────────────────────────────────────────────
  {
    name: 'Basil',
    emoji: '🌿',
    daysToMaturity: 30,
    daysRange: '25–40',
    wateringInterval: 1,
    sun: 'Full sun',
    description: 'Loves warmth — sow after last frost or keep indoors. Pinch out flower buds to extend leaf production. Water at the base, not the leaves.',
    varieties: ['Genovese', 'Thai', 'Purple', 'Lemon', 'Greek Mini'],
  },
  {
    name: 'Parsley',
    emoji: '🌿',
    daysToMaturity: 75,
    daysRange: '70–90',
    wateringInterval: 2,
    sun: 'Full sun / partial shade',
    description: 'Slow to germinate (3–6 weeks). Soak seed overnight to speed germination. Biennial — bolts in year two. Sow fresh each spring.',
    varieties: ['Flat Leaf', 'Curly', 'Hamburg (root)', 'Giant Italian'],
  },
  {
    name: 'Coriander',
    emoji: '🌿',
    daysToMaturity: 40,
    daysRange: '30–45',
    wateringInterval: 1,
    sun: 'Partial shade',
    description: 'Bolts quickly in heat — sow little and often (every 3 weeks). Shade in summer extends leaf harvest. Harvest young leaves.',
    varieties: ['Leisure', 'Slow Bolt', 'Santo', 'Confetti'],
  },
  {
    name: 'Dill',
    emoji: '🌿',
    daysToMaturity: 45,
    daysRange: '40–55',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Direct sow — dislikes transplanting. Do not plant near fennel (they cross-pollinate). Harvest leaves young; let some plants set seed.',
    varieties: ['Bouquet', 'Fernleaf', 'Dukat', 'Long Island Mammoth'],
  },
  {
    name: 'Chives',
    emoji: '🌿',
    daysToMaturity: 60,
    daysRange: '60–90',
    wateringInterval: 2,
    sun: 'Full sun / partial shade',
    description: 'Perennial — cut back hard after flowering to encourage fresh growth. Edible pink flowers great in salads.',
    varieties: ['Common', 'Garlic Chives', 'Giant Siberian'],
  },
  {
    name: 'Mint',
    emoji: '🌿',
    daysToMaturity: 90,
    daysRange: '80–100',
    wateringInterval: 1,
    sun: 'Partial shade',
    description: 'Perennial. Grow in a container to prevent it taking over the garden. Keep moist. Cut back after flowering for fresh growth.',
    varieties: ['Spearmint', 'Peppermint', 'Chocolate', 'Apple', 'Mojito'],
  },
  {
    name: 'Thyme',
    emoji: '🌿',
    daysToMaturity: 85,
    daysRange: '75–100',
    wateringInterval: 4,
    sun: 'Full sun',
    description: 'Mediterranean herb — prefers dry, well-drained soil. Trim lightly after flowering. Very drought tolerant once established.',
    varieties: ['Common', 'Lemon', 'Creeping', 'Silver', 'French'],
  },
  {
    name: 'Rosemary',
    emoji: '🌿',
    daysToMaturity: 90,
    daysRange: '80–120',
    wateringInterval: 5,
    sun: 'Full sun',
    description: 'Shrubby perennial. Needs good drainage — hates waterlogged soil. Slow from seed; easier from cuttings. Evergreen — harvest year round.',
    varieties: ['Miss Jessopp\'s Upright', 'Tuscan Blue', 'Prostratus', 'Arp'],
  },

  // ── Fruiting vegetables ──────────────────────────────────
  {
    name: 'Aubergine',
    emoji: '🍆',
    daysToMaturity: 90,
    daysRange: '80–100',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Needs long warm season — start indoors Jan–Feb. Requires heat (25 °C+) for fruit to set. Best grown in greenhouse in UK climates.',
    varieties: ['Black Beauty', 'Moneymaker', 'Listada de Gandia', 'Rosa Bianca', 'Thai Long'],
  },
  {
    name: 'Sweetcorn',
    emoji: '🌽',
    daysToMaturity: 80,
    daysRange: '70–90',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Wind-pollinated — plant in blocks rather than rows. Direct sow after last frost or start in modules. Ready when silks turn brown.',
    varieties: ['Swift', 'Earlybird', 'Sundance', 'Indian Summer', 'Minipop'],
  },

  // ── Fruits ───────────────────────────────────────────────
  {
    name: 'Strawberry',
    emoji: '🍓',
    daysToMaturity: 60,
    daysRange: '28–60',
    wateringInterval: 2,
    sun: 'Full sun',
    description: 'Perennial. Plant crowns with the crown at soil level — too deep rots, too shallow dries. Remove runners in year 1 for bigger fruit.',
    varieties: ['Elsanta', 'Honeoye', 'Cambridge Favourite', 'Mara des Bois', 'Albion'],
  },
]

// Build a lowercase index for fast search
const INDEX = PLANT_DB.map((p) => ({
  ...p,
  _search: p.name.toLowerCase(),
}))

/**
 * Find plants matching the query string.
 * Returns up to `limit` results sorted by how early the match appears.
 */
export function searchPlants(query, limit = 6) {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return INDEX
    .filter((p) => p._search.includes(q))
    .sort((a, b) => a._search.indexOf(q) - b._search.indexOf(q))
    .slice(0, limit)
}

/**
 * Find an exact (case-insensitive) plant by name.
 */
export function findPlant(name) {
  return INDEX.find((p) => p._search === name.toLowerCase()) ?? null
}
