// Start here. Images use paths relative to site/index.html, or full HTTPS URLs.
// Passcodes are text, so leading zeroes work. Use unique codes for all entries.
const photoImage = "./assets/memory-placeholder.svg";

export const parentsPasscode = "averylozachristmas";

// Keep each ID stable so existing reservations follow the gift.
function product(id, name, url, price, details = {}) {
  return { id, name, url, price, image: `./assets/products/${id}.webp`, ...details };
}

export const familyGifts = [
  product("keyboard", "Royal Kludge R65 Wired Keyboard", "https://www.amazon.com/dp/B0CNP1BG1W", "$59.99", { preference: "Black · Cream switches", starred: true }),
  product("mouse", "JLab JBuds Bluetooth Mouse", "https://www.bestbuy.com/product/jlab-jbuds-wireless-mouse-wireless-black/J3LXRQK272", "$25.49", { preference: "Black", starred: true }),
  product("mousepad", "SteelSeries QcK Medium Mousepad", "https://www.bestbuy.com/product/steelseries-qck-cloth-gaming-mouse-pad-medium-black/2822575", "$11.99", { preference: "Black" }),
  product("monitor", "MSI PRO MP225 E12VL Monitor", "https://www.bestbuy.com/product/msi-pro-mp225-e12vl-22-ips-fhd-120hz-1ms-business-monitor-with-eyesergo-tech-video-port-hdmi-black/J3P7TXHHG5", "$64.99", { preference: "22-inch · 120Hz" }),
  product("sheets", "Threadmill 300TC Cotton Queen Sheet Set", "https://www.amazon.com/dp/B073CX9RYZ", "$44.99", { preference: "Dark gray · 4-piece", starred: true }),
  product("bedding", "100% Cotton Reversible Queen Comforter Set", "https://www.amazon.com/dp/B0GYRQ8JWQ", "", { preference: "Dark-gray stripe · 90 × 90 in.", starred: true }),
  product("sweatpants", "Shaka Wear Los Angeles 13.5oz Baggy Sweatpants", "https://www.shakawear.com/products/los-angeles-13-5oz-heavyweight-garment-dye-baggy-sweatpants", "$48.90", { preference: "Black garment dye" }),
  product("headset", "Logitech G435 Wireless Gaming Headset", "https://www.bestbuy.com/product/logitech-g435-wireless-over-the-ear-gaming-headset-for-pc-playstation-5-or-playstation-4-nintendo-switch-black/J7H7ZY3Q36", "$49.99", { preference: "Black", starred: true }),
  product("mai", "Mai Sakurajima — Taito Uniform Bunny Figure", "https://store.crunchyroll.com/products/rascal-series-mai-sakurajima-prize-figure-uniform-bunny-ver-662248836775.html", "$21.99", { starred: true }),
  product("ochaco", "Ochaco Uraraka — Banpresto Amazing Heroes Vol. 32 Figure", "https://www.boxlunch.com/product/banpresto-my-hero-academia-the-amazing-heroes-ochaco-uraraka-vol.-32-figure/20483198.html", "$28.90", { starred: true }),
  product("toga", "Himiko Toga — Banpresto Duffel Coat Figure", "https://www.gamestop.com/collectibles/figures/products/banpresto-my-hero-academia-glitters-and-glamours-himiko-toga-duffel-coat-ver.-8.7-in-figure/20027810.html", "", { starred: true }),
  product("pillows", "Mainstays Foam Cluster Pillows", "https://www.walmart.com/ip/5246348000", "", { preference: "Two King and two Standard/Queen. The link opens the King size.", starred: true }),
];

export const parentsGifts = [
  product("hiking-boots", "The North Face Glenclyffe Mid Insulated Waterproof Boots", "https://www.thenorthface.com/en-us/p/mens/mens-footwear/mens-boots-695280/glenclyffe-mid-insulated-waterproof-boots-NF0A8AB4?color=KX7", "$165.00", { preference: "TNF Black/TNF Black" }),
  product("trail-runners", "Salomon Speedcross 6 GORE-TEX", "https://www.salomon.com/en-us/product/speedcross-6-gore-tex-lg9214/L41738600", "", { preference: "Black/Black/Phantom" }),
  product("skate-shoes", "ASICS JAPAN PRO", "https://www.asics.com/us/en-us/japan-pro/p/ANA_1201A920-001.html", "$105.00", { preference: "Black/White" }),
  product("harness-boots", "Durango DB510 Harness Boots", "https://durangoboots.com/products/db510", "$181.50", { preference: "Black" }),
  product("backpack", "The North Face Recon Backpack 30L", "https://www.thenorthface.com/en-us/p/bags-and-gear/backpacks/mens-backpacks-298772/recon-backpack-30l-NF0A52SH?color=4HF", "$125.00", { preference: "TNF Black/TNF Black" }),
  product("jeans", "Bronson Lot 37801XX 1937 Selvedge Denim Jeans", "https://bronsonshop.com/products/lot-37801xx-1937-selvedge-denim-jeans", "$129.99", { preference: "Indigo", starred: true }),
  product("pro-controller", "SCUF OMEGA PS5 Wireless Performance Controller", "https://www.amazon.com/dp/B0GHPHNF5D", "$219.99", { preference: "Light Gray" }),
];

export const stockingStuffers = [
  product("headphones", "JBL Tune 520C USB-C Wired Headphones", "https://www.walmart.com/ip/15915808665", "$17.99", { preference: "Black" }),
  product("storage", "Toshiba Canvio Basics 1TB External Hard Drive", "https://www.walmart.com/ip/2051678311", "$58.99", { preference: "USB storage for PS5. Copy PS5 games back to console storage to play." }),
  product("charger", "Anker 65W Three-Port GaN Charger", "https://www.target.com/p/-/A-94682235", "$23.99"),
  product("cable", "Anker 100W USB-C Cable", "https://www.target.com/p/-/A-1012956839", "", { preference: "10 feet · Silver" }),
  product("micro-blades", "Kitsch Dermaplaning Razors", "https://www.target.com/p/-/A-91792330", "", { preference: "Black · 12-pack" }),
  product("razor", "GilletteLabs Razor", "https://www.target.com/p/-/A-83384709", "", { preference: "Two cartridges and magnetic stand" }),
  product("boxers", "Calvin Klein Cotton Classics Boxer Briefs", "https://www.calvinklein.us/en/underwear/men/multipacks/cotton-classics-5-pack-boxer-brief/NB1429-TIR.html", "$53.55", { preference: "Black/White · Medium · Five-pack" }),
  product("naruto-socks", "Naruto Shippuden Clan Crew Socks", "https://www.target.com/p/-/A-87877393", "", { preference: "Five-pack" }),
  product("rick-socks", "Rick and Morty Character Crew Socks", "https://www.target.com/p/-/A-88283270", "", { preference: "Three-pack" }),
  product("snoopy-socks", "Snoopy / Peanuts Socks", "https://www.target.com/c/socks-men-s-clothing/peanuts/-/N-5xu21Z5y3eo", "", { preference: "Any Snoopy design · photo is an example" }),
  product("confessions", "Confessions — Saint Augustine", "https://www.barnesandnoble.com/w/st-augustines-confessions-saint-augustine/1026272028", "", { preference: "Henry Chadwick translation" }),
  product("karamazov", "The Brothers Karamazov — Fyodor Dostoevsky", "https://www.barnesandnoble.com/w/the-brothers-karamazov-fyodor-dostoevsky/1142243313", "", { preference: "Michael R. Katz translation" }),
  product("sisyphus", "The Myth of Sisyphus — Albert Camus", "https://www.barnesandnoble.com/w/the-myth-of-sisyphus-albert-camus/1100988606", ""),
  product("fire-next-time", "The Fire Next Time — James Baldwin", "https://www.barnesandnoble.com/w/the-fire-next-time-james-baldwin/1100157523", ""),
];

export const familyMemory = {
  heading: "Printed memories",
  message: "If you can, print a photo of us and write a little note about what you remember from that day. I'd love to keep it.",
};

// Privileges opens with parentsPasscode, the same code as the red stocking.
export const privileges = [
  "Get your ears pierced",
  "Dye your hair",
  "Move your bedtime to 10:15 p.m.",
  "Ride the bus",
  "Go places alone",
  "Cook alone",
  "Get a week’s worth of your own groceries",
];

const printedMemory = "If you can, tuck a printed photo of us and a handwritten note about what you remember from that day in with your gift.";

export const personalPages = [
  {
    passcodes: ["a-request-for-a-vet", "snowboarding-with-a-fogger"],
    heading: "Dear Edwin, Alex, Jos, and Claire,",
    message: "For Christmas, I’d love a day out with all four of you.",
    experience: "Could we go snowboarding together, or spend the day at Six Flags?",
    specialRequest: printedMemory,
    placeholder: true,
  },
  {
    passcodes: ["COCOLOCO"],
    heading: "Dear Tío Coco,",
    message: "I’d love to spend a day together.",
    experience: "Would you take me to the shooting range sometime?",
    specialRequest: printedMemory,
    placeholder: true,
  },
  {
    passcodes: ["tiosandsushi"],
    heading: "Dear Tíos,",
    message: "For Christmas, I want to get everyone together at the same table.",
    experience: "Can we go out for all-you-can-eat sushi together?",
    specialRequest: printedMemory,
    placeholder: true,
  },
  {
    passcodes: ["cedar26"],
    heading: "Dear Aunt Jamie,",
    message: "You always have a story about some place I’ve walked right past. I want to see a few of those spots with you.",
    photo: photoImage,
    photoAlt: "Placeholder for a photo of Jamie and Nathan",
    photoCaption: "If you can, add an old family photo here.",
    experience: "A downtown walk and lunch somewhere you used to go.",
    specialRequest: printedMemory,
    placeholder: true,
  },
  {
    passcodes: ["snow26"],
    heading: "Dear Uncle Sam,",
    message: "Pick a movie you loved when you were my age. I want to see it and hear what you remember about it.",
    photo: photoImage,
    photoAlt: "Placeholder for a photo of Sam and Nathan",
    photoCaption: "If you can, add a photo from a day out together.",
    experience: "A matinee and a long talk over coffee after.",
    specialRequest: printedMemory,
    placeholder: true,
  },
];
