// ================================================================
//  ItemList.js  --  THE STORE'S PRODUCT DATA (the "database")
// ================================================================
//
//  WHAT IS THIS FILE?
//  It holds NO actions - it only stores information (data).
//  The other files read it to draw products on the pages:
//      app.js  -> uses prebuiltPCs, PRODUCTS and peso()
//
//  THIS FILE IS LOADED FIRST (before app.js) on every page,
//  because app.js needs this data to exist already.
//
//  TABLE OF CONTENTS:
//     1. prebuiltPCs ..... complete ready-made computers (4 items)
//     2. PRODUCTS ........ individual parts, grouped by category
//                          (in this order): CPU, Motherboard, RAM,
//                          Storage, GPU, PSU, Case, CoolingSystem,
//                          Peripheral
//     3. peso() .......... turns 13499 into "₱13,499"
//
//  BEGINNER TIPS:
//   - [ ... ] is a LIST (array). { ... } is one ITEM (object).
//   - Each field looks like   name: value   and ends with a comma
//     (the last field in an item has no comma).
//   - Text goes in "quotes". Numbers do NOT (price: 13499).
//   - Every item needs a UNIQUE id. It is used in the web address
//     (product.html?slug=prs1) and in the cart.
//   - To ADD a product: copy one whole { ... } block, paste it after
//     another block (put a comma between blocks) and edit the values.
//   - To REMOVE one: delete its whole { ... } block (and its comma).
//   - "const" means the list name can't be re-assigned later.
// ================================================================


// ================================================================
// 1) PREBUILT PCs  (complete computers)
// ----------------------------------------------------------------
// Fields used by these items:
//    id            unique name, e.g. "prebuilt1"
//    badge         small label on the card ("Top tier")
//    badgeClass    CSS class that colors the badge
//    image         picture path
//    subtitle      small line above the title
//    title / name  full product name (name is used by search & cart)
//    brand         seller/brand name
//    category      "Prebuilt" (used for grouping)
//    categoryLabel readable category shown on the page
//    price         number used for math (cart total)
//    priceLabel    text shown on the card ("₱195,000")
//    description   short paragraph
//    stock         how many are available
//    specs         list of parts (<strong> makes the label bold)
// ================================================================
const prebuiltPCs = [
    {   id: "prebuilt1",
        badge: "Top tier",
        badgeClass: "badge-toptier",
        image: "assets/Front img/b2.1-cut.png",
        subtitle: "J&J Custom",
        title: "Ryzen 7 9800X3D + RTX 5070 Ti 16GB + RGB 64GB 6000MHz DDR5",
        name: "Ryzen 7 9800X3D + RTX 5070 Ti 16GB + RGB 64GB 6000MHz DDR5",
        brand: "J&J Custom",
        category: "Prebuilt",
        categoryLabel: "Pre-built PCs",
        price: 195000,
        priceLabel: "₱195,000",
        description: "Top-tier pre-built system: Ryzen 7 9800X3D + RTX 5070 Ti 16GB + 64GB RGB DDR5-6000.",
        stock: 3,
        specs: [
            "<strong>CPU:</strong> Ryzen 7 9800X3D 8C/16T",
            "<strong>Motherboard:</strong> ROG Strix B850-F Gaming Wifi",
            "<strong>GPU:</strong> Asus ROG Strix RTX 5070ti 16gb Trifan",
            "<strong>RAM:</strong> Gskill Trident Z5 RGB 64GB (2x32gb) 6000MHz DDR5",
            "<strong>Storage:</strong> Samsung 990 Pro 2TB NVMe",
            "<strong>Cooler:</strong> ROG Strix Ryuo IV SLC 360 LCD liquid Cooler",
            "<strong>PSU:</strong> Rog Strix 1000W 80+ Platinum Full Modular",
            "<strong>Case:</strong> NZXT H6 Flow Black Case",
            "<strong>Fans:</strong> Lian Li Unifan 6pcs"
        ]
    },
    {   id: "prebuilt2",
        badge: "Bundle",
        badgeClass: "badge-bundle",
        image: "assets/Front img/b3.1-cut.png",
        subtitle: "J&J Custom",
        title: "Ryzen 5 5600X + RX 7600 + 16GB 3200MHz DDR4",
        name: "Ryzen 5 5600X + RX 7600 + 16GB 3200MHz DDR4",
        brand: "J&J Custom",
        category: "Prebuilt",
        categoryLabel: "Pre-built PCs",
        price: 67995,
        priceLabel: "₱67,995",
        description: "Mid-range gaming bundle: Ryzen 5 5600X + RX 7600 8GB + 16GB DDR4-3200.",
        stock: 5,
        specs: [
            "<strong>CPU:</strong> Ryzen 5 5600x 6C/12T",
            "<strong>Motherboard:</strong> Gigabyte B550M Aorus Elite",
            "<strong>GPU:</strong> Askrock Challenger RX 7600 8gb",
            "<strong>RAM:</strong> Simorchip 16GB (2x8gb) 3200MHz DDR4",
            "<strong>Storage:</strong> Esgaming 1TB Sata",
            "<strong>Cooler:</strong> JL ProFlow 360mm w/ LCD liquid Cooler",
            "<strong>PSU:</strong> XPG Probe 600W 80+ Bronze",
            "<strong>Case:</strong> WJ Coolman Millenium Case",
            "<strong>Fans:</strong> Transwarp 3in1 fans"
        ]
    },
    {   id: "prebuilt3",
        badge: "Build",
        badgeClass: "badge-build",
        image: "assets/Front img/b1-cut.png",
        subtitle: "J&J Custom",
        title: "Ryzen 5 5600X + RX 9060 XT + 16GB 3600MHz DDR4",
        name: "Ryzen 5 5600X + RX 9060 XT + 16GB 3600MHz DDR4",
        brand: "J&J Custom",
        category: "Prebuilt",
        categoryLabel: "Pre-built PCs",
        price: 65500,
        priceLabel: "₱65,500",
        description: "Solid 1080p/1440p build: Ryzen 5 5600X + RX 9060 XT 16GB + 16GB DDR4-3600.",
        stock: 4,
        specs: [
            "<strong>CPU:</strong> Ryzen 5 5600X 6C/12T",
            "<strong>Motherboard:</strong> MSI B550M PRO-VDH Wifi",
            "<strong>GPU:</strong> RX 9060 XT 16GB",
            "<strong>RAM:</strong> 16GB 3600MHz DDR4",
            "<strong>Storage:</strong> 500GB NVMe SSD",
            "<strong>Cooler:</strong> JL Proflow 360mm LCD",
            "<strong>PSU:</strong> 1stplayer NGDP 750W 80+ Gold Full Modular",
            "<strong>Case:</strong> WJ Coolman Millenium w/ Screen Case",
            "<strong>Fans:</strong> Galaxy 3in1 Fans"
        ]
    },
    {   id: "prebuilt4",
        badge: "Pre-owned",
        badgeClass: "badge-preowned",
        image: "assets/Front img/b4-cut.png",
        subtitle: "J&J Custom (pre-owned)",
        title: "Intel i7-10700 + RTX 3070 Ti + 16GB 3200MHz DDR4",
        name: "Intel i7-10700 + RTX 3070 Ti + 16GB 3200MHz DDR4",
        brand: "J&J Custom (pre-owned)",
        category: "Prebuilt",
        categoryLabel: "Pre-built PCs",
        price: 50000,
        priceLabel: "₱50,000",
        description: "Budget pre-owned rig: Intel i7-10700 + RTX 3070 Ti 8GB + 16GB DDR4-3200.",
        stock: 2,
        specs: [
            "<strong>CPU:</strong> Intel Core i7 10700 8C/16T",
            "<strong>Motherboard:</strong> ROG Maximus Z590 F",
            "<strong>GPU:</strong> Asus Tuf RTX 3070ti 8gb",
            "<strong>RAM:</strong> Hyper X 16GB (2x8gb) 3200MHz DDR4",
            "<strong>Storage:</strong> Kingston 240gb + Seagate 1TB HDD",
            "<strong>Cooler:</strong> ID Cooling 240mm liquid Cooler",
            "<strong>PSU:</strong> Gigabyte 750GM power supply",
            "<strong>Case:</strong> Asus Tuf ATX Case",
            "<strong>Fans:</strong> ID Cooling Fans"
        ]
    }
];



// ================================================================
// 2) PRODUCTS  (individual computer parts)
// ----------------------------------------------------------------
// Fields used by these items:
//    id            unique short code, e.g. "prs1" (CPU), "gc2" (GPU)
//    name          full product name
//    brand         maker/brand
//    category      group used by the shop filter buttons
//                  (CPU, Motherboard, GPU, RAM, Storage, Case,
//                   CoolingSystem, PSU, Peripheral)
//                  NOTE: must match the data-cat value of the
//                  filter buttons in shop.html exactly!
//    categoryLabel readable category shown on the product page
//    price         CURRENT price (number)
//    was           OLD price (optional). If it exists the site shows
//                  a strikethrough price and a "-20%" discount badge.
//                  Leave this line out if there is no discount.
//    image         picture path
//    stock         how many are available
//    description   short paragraph
//    specs         list of bullet points on the product page
//
// Example of one item:
//    {
//        id: "prs1",
//        name: "AMD Ryzen 7 5700G Desktop Processor",
//        brand: "AMD",
//        category: "CPU",
//        categoryLabel: "Processors",
//        price: 13499,
//        was: 15999,
//        image: "assets/Product img/CPU/prs1.png",
//        stock: 12,
//        description: "...",
//        specs: [ "Cores / Threads: 8 / 16", "Socket: AM4" ]
//    },
// ================================================================
const PRODUCTS = [
    // ----------------------------------------------------------
    // CPU (processors)
    // ----------------------------------------------------------
    {
        id: "prs1",
        name: "AMD Ryzen 7 5700G Desktop Processor",
        brand: "AMD",
        category: "CPU",
        categoryLabel: "Processors",
        price: 13499,
        was: 15999,
        image: "assets/Product img/CPU/prs1.png",
        stock: 12,
        description: "AMD RYZEN 7 5700G tray-type desktop processor. 8 cores, 16 threads, AM4 socket, 4.6GHz boost, integrated Radeon graphics. 6 months warranty.",
        specs: [
            "Cores / Threads: 8 / 16",
            "Base Clock: 3.8 GHz — Boost: 4.6 GHz",
            "Socket: AM4",
            "Graphics: Radeon integrated",
            "TDP: 65W",
            "6 months warranty"
        ]
    },

    {
        id: "prs2",
        name: "AMD Ryzen 5 3600 Desktop Processor",
        brand: "AMD",
        category: "CPU",
        categoryLabel: "Processors",
        price: 5990,
        was: 6035,
        image: "assets/Product img/CPU/prs2.png",
        stock: 15,
        description: "AMD Ryzen 5 3600 desktop processor with Wraith Stealth cooler. 6 cores, 12 threads, AM4 socket, 4.2GHz boost. 1 year warranty.",
        specs: [
            "Cores / Threads: 6 / 12",
            "Base Clock: 3.6 GHz — Boost: 4.2 GHz",
            "Socket: AM4",
            "Graphics: Requires discrete graphics",
            "TDP: 65W",
            "1 year warranty"
        ]
    },

    {
        id: "prs3",
        name: "AMD Ryzen 3 3200G Desktop Processor",
        brand: "AMD",
        category: "CPU",
        categoryLabel: "Processors",
        price: 3117,
        was: 3595,
        image: "assets/Product img/CPU/prs3.png",
        stock: 20,
        description: "AMD Ryzen 3 3200G desktop processor with Radeon Vega 8 graphics. 4 cores, 4 threads, AM4 socket, 3.6GHz base clock.",
        specs: [
            "Cores / Threads: 4 / 4",
            "Base Clock: 3.6 GHz — Boost: 4.0 GHz",
            "Socket: AM4",
            "Graphics: Radeon Vega 8 integrated",
            "TDP: 65W",
            "1 year warranty"
        ]
    },
    {
        id: "prs4",
        name: "AMD Ryzen 9 3900X Desktop Processor",
        brand: "AMD",
        category: "CPU",
        categoryLabel: "Processors",
        price: 11999,
        was: 14500,
        image: "assets/Product img/CPU/prs4.png",
        stock: 8,
        description: "AMD Ryzen 9 3900X 3rd Gen desktop processor. 12 cores, 24 threads, AM4 socket, PCIe 4.0 ready, 4.6GHz max boost.",
        specs: [
            "Cores / Threads: 12 / 24",
            "Base Clock: 3.8 GHz — Boost: 4.6 GHz",
            "Socket: AM4",
            "PCIe Version: PCIe 4.0 Ready",
            "TDP: 105W",
            "1 year warranty"
        ]
    },

    {
        id: "prs5",
        name: "Intel Core i3-9100F Desktop Processor",
        brand: "Intel",
        category: "CPU",
        categoryLabel: "Processors",
        price: 2995,
        was: 3895,
        image: "assets/Product img/CPU/prs5.png",
        stock: 10,
        description: "9th Generation Intel Core i3-9100F Coffee Lake processor. 4 cores, 4 threads, LGA 1151 socket, 3.60GHz base frequency.",
        specs: [
            "Cores / Threads: 4 / 4",
            "Base Frequency: 3.60 GHz — Max Turbo: 4.20 GHz",
            "Socket: LGA 1151",
            "Graphics: Discrete graphics required",
            "TDP: 65W",
            "1 year warranty"
        ]
    },

    {

        id: "prs6",
        name: "Intel Pentium Gold Desktop Processor",
        brand: "Intel",
        category: "CPU",
        categoryLabel: "Processors",
        price: 2499,
        was: 2999,
        image: "assets/Product img/CPU/prs6.png",
        stock: 14,
        description: "Intel Pentium Gold desktop processor featuring Intel Hyper-Threading technology and integrated Intel UHD Graphics.",
        specs: [
            "Cores / Threads: 2 / 4",
            "Smart Cache: 4MB",
            "Socket Compatibility: LGA 1151 / LGA 1200",
            "Graphics: Intel UHD Graphics",
            "TDP: 54W",
            "1 year warranty"
        ]
    },
    {
        id: "prs7",
        name: "Intel Core i7-9700K Desktop Processor",
        brand: "Intel",
        category: "CPU",
        categoryLabel: "Processors",
        price: 15499,
        was: 17999,
        image: "assets/Product img/CPU/prs7.png",
        stock: 6,
        description: "9th Gen Intel Core i7-9700K unlocked desktop processor. 8 cores, 8 threads, LGA 1151 socket, up to 4.90GHz turbo frequency.",
        specs: [
            "Cores / Threads: 8 / 8",
            "Base Frequency: 3.60 GHz — Turbo: 4.90 GHz",
            "Socket: LGA 1151",
            "Unlocked for Overclocking: Yes",
            "TDP: 95W",
            "1 year warranty"
        ]
    },
    {
        id: "prs8",
        name: "Intel Core i5-9400F Desktop Processor",
        brand: "Intel",
        category: "CPU",
        categoryLabel: "Processors",
        price: 6499,
        was: 7499,
        image: "assets/Product img/CPU/prs8.png",
        stock: 12,
        description: "9th Gen Intel Core i5-9400F desktop processor. 6 cores, 6 threads, LGA 1151 socket, 2.90GHz base up to 4.10GHz turbo. Discrete graphics required.",
        specs: [
            "Cores / Threads: 6 / 6",
            "Base Frequency: 2.90 GHz — Turbo: 4.10 GHz",
            "Socket: LGA 1151",
            "Graphics: Discrete graphics required",
            "TDP: 65W",
            "1 year warranty"
        ]
    },

    // ----------------------------------------------------------
    // MOTHERBOARDS
    // ----------------------------------------------------------
    {
        id: "m1",
        name: "ASUS B650M-AYW WIFI DDR5 Motherboard",
        brand: "ASUS",
        category: "Motherboard",
        categoryLabel: "Motherboards",
        price: 11499,
        was: 13999,
        image: "assets/Product img/Motherboard/M1.png",
        stock: 9,
        description: "ASUS B650M-AYW WIFI DDR5 AM5 Micro-ATX motherboard with PCIe 5.0 M.2, Wi-Fi 6, Realtek 2.5Gb Ethernet, and Aura Sync RGB. 12 months warranty.",
        specs: [
            "Socket: AM5",
            "Form factor: Micro-ATX",
            "Memory: 2x DIMM DDR5",
            "Storage: 1x PCIe 5.0 M.2 + 4x SATA",
            "Networking: Wi-Fi 6 + Realtek 2.5Gb Ethernet",
            "Two-way AI noise cancellation, Aura Sync RGB",
            "12 months warranty"
        ]
    },

    {
        id: "m2",
        name: "MSI B550M-A PRO Desktop Motherboard",
        brand: "MSI",
        category: "Motherboard",
        categoryLabel: "Motherboards",
        price: 4999,
        was: 5899,
        image: "assets/Product img/Motherboard/M2.png",
        stock: 12,
        description: "MSI B550M-A PRO AMD AM4 micro-ATX motherboard with DDR4, PCIe 4.0, Lightning Gen 4 M.2, and 2oz Copper PCB design.",
        specs: [
            "Socket: AM4",
            "Form factor: Micro-ATX",
            "Memory: 2x DIMM DDR4",
            "Storage: 1x M.2 Gen 4 + SATA 6Gb/s",
            "PCIe 4.0 Ready",
            "Copper PCB 2oz design",
            "12 months warranty"
        ]
    },

    {
        id: "m3",
        name: "ECS H110M-C3D Durathon 2 Motherboard",
        brand: "ECS",
        category: "Motherboard",
        categoryLabel: "Motherboards",
        price: 2450,
        was: 2950,
        image: "assets/Product img/Motherboard/M3.png",
        stock: 8,
        description: "ECS H110M-C3D Durathon 2 motherboard supporting Intel 6th/7th Gen processors, LGA 1151 socket, designed for quality, stability, and convenience.",
        specs: [
            "Socket: LGA 1151",
            "Form factor: Micro-ATX",
            "Durathon 2 Technology for stability",
            "Supports Intel 6th/7th Gen CPUs",
            "Multi-VGA output support",
            "12 months warranty"
        ]
    },

    {
        id: "m4",
        name: "Gigabyte F2A68HM-S1 FM2+ Motherboard",
        brand: "Gigabyte",
        category: "Motherboard",
        categoryLabel: "Motherboards",
        price: 2899,
        was: 3499,
        image: "assets/Product img/Motherboard/M4.png",
        stock: 10,
        description: "Gigabyte Ultra Durable F2A68HM-S1 motherboard for AMD FM2/FM2+ APUs, featuring high quality On/Off Charge and New Glass Fabric PCB design.",
        specs: [
            "Socket: FM2 / FM2+",
            "Form factor: Micro-ATX",
            "Ultra Durable Technology",
            "New Glass Fabric PCB design",
            "Anti-Surge and Humidity protection",
            "12 months warranty"
        ]
    },

    // ----------------------------------------------------------
    // RAM (memory)
    // ----------------------------------------------------------
    {
        id: "r1",
        name: "ADATA XPG SPECTRIX D50 16GB DDR4-3200 RGB — White",
        brand: "ADATA",
        category: "RAM",
        categoryLabel: "Memory",
        price: 3299,
        was: 4299,
        image: "assets/Product img/RAM/r1.png",
        stock: 18,
        description: "ADATA XPG SPECTRIX D50 16GB (2x8GB) DDR4 3200MHz RGB memory kit in white. Tuned XMP profiles for plug-and-play overclocking. 12 months warranty.",
        specs: [
            "Capacity: 16GB (2 x 8GB)",
            "Type: DDR4",
            "Speed: 3200 MHz",
            "RGB lighting with XPG Prime",
            "Color: White",
            "12 months warranty"
        ]
    },

    {
        id: "r2",
        name: "Kingston HyperX Fury 16GB DDR4-3200 Black",
        brand: "Kingston",
        category: "RAM",
        categoryLabel: "Memory",
        price: 2899,
        was: 3599,
        image: "assets/Product img/RAM/r2.png",
        stock: 25,
        description: "Kingston HyperX Fury 16GB DDR4 3200MHz memory module in black. Cost-effective, high-performance upgrade with stylish low-profile heat spreader. 12 months warranty.",
        specs: [
            "Capacity: 16GB (1 x 16GB)",
            "Type: DDR4",
            "Speed: 3200 MHz",
            "Heat spreader: Low-profile black design",
            "Color: Black",
            "12 months warranty"
        ]
    },
    {
        id: "r3",
        name: "Biostar Storming V 8GB DDR4-3200 Black",
        brand: "Biostar",
        category: "RAM",
        categoryLabel: "Memory",
        price: 1499,
        was: 1999,
        image: "assets/Product img/RAM/r3.png",
        stock: 30,
        description: "Biostar Storming V 8GB DDR4 3200MHz desktop memory stick with rugged black heatsink for efficient heat dissipation. 12 months warranty.",
        specs: [
            "Capacity: 8GB (1 x 8GB)",
            "Type: DDR4",
            "Speed: 3200 MHz",
            "Heatsink: Storming V black design",
            "Color: Black",
            "12 months warranty"
        ]
    },
    {
        id: "r4",
        name: "NKC HU40 8GB DDR4-3200 Black",
        brand: "NKC",
        category: "RAM",
        categoryLabel: "Memory",
        price: 1399,
        was: 1799,
        image: "assets/Product img/RAM/r4.png",
        stock: 22,
        description: "NKC HU40 8GB DDR4 desktop memory stick featuring a sleek black heat spreader with white accent lines and branding. 12 months warranty.",
        specs: [
            "Capacity: 8GB (1 x 8GB)",
            "Type: DDR4",
            "Speed: 3200 MHz",
            "Design: HU40 black heatsink with white accents",
            "Color: Black",
            "12 months warranty"
        ]
    },

    // ----------------------------------------------------------
    // STORAGE (SSD / HDD)
    // ----------------------------------------------------------
    {
        id: "s1",
        name: "AFOX 2.5\" 120GB SATA SSD",
        brand: "AFOX",
        category: "Storage",
        categoryLabel: "Storage",
        price: 899,
        was: 1199,
        image: "assets/Product img/Storage/s1.png",
        stock: 25,
        description: "AFOX 2.5-inch 120GB SATA III solid-state drive. Great choice for an OS / boot drive or as a small fast secondary drive. 12 months warranty.",
        specs: [
            "Capacity: 120 GB",
            "Form factor: 2.5\"",
            "Interface: SATA III 6Gb/s",
            "Read: up to 550 MB/s",
            "Write: up to 480 MB/s",
            "12 months warranty"
        ]
    },

    {
        id: "s2",
        name: "TeamGroup MP33 512GB M.2 NVMe PCIe SSD",
        brand: "TeamGroup",
        category: "Storage",
        categoryLabel: "Storage",
        price: 2499,
        was: 3199,
        image: "assets/Product img/Storage/s2.png",
        stock: 20,
        description: "TeamGroup MP33 512GB M.2 2280 PCIe Gen3 x4 NVMe solid-state drive. High-speed performance for modern laptops and PCs. 5 years warranty.",
        specs: [
            "Capacity: 512 GB",
            "Form factor: M.2 2280",
            "Interface: PCIe Gen3 x4 NVMe",
            "5 years warranty"
        ]
    },
    {
        id: "s3",
        name: "Hiksemi Wave 2.5\" 256GB SATA SSD",
        brand: "Hiksemi",
        category: "Storage",
        categoryLabel: "Storage",
        price: 1299,
        was: 1699,
        image: "assets/Product img/Storage/s3.png",
        stock: 35,
        description: "Hiksemi Wave series 2.5-inch 256GB SATA III solid-state drive with a vibrant green wave design. Reliable storage upgrade for faster boot and load times. 12 months warranty.",
        specs: [
            "Capacity: 256 GB",
            "Form factor: 2.5\"",
            "Interface: SATA III 6Gb/s",
            "Series: Wave",
            "12 months warranty"
        ]
    },
    {
        id: "s4",
        name: "ESGAMING 2.5\" 256GB SATA SSD",
        brand: "ESGAMING",
        category: "Storage",
        categoryLabel: "Storage",
        price: 1349,
        was: 1749,
        image: "assets/Product img/Storage/s4.png",
        stock: 15,
        description: "ESGAMING 2.5-inch 256GB SATA Rev. 3.0 solid-state drive. Delivers snappy system responsiveness and dependable data storage. 12 months warranty.",
        specs: [
            "Capacity: 256 GB",
            "Form factor: 2.5\"",
            "Interface: SATA Rev. 3.0 (6Gb/s)",
            "12 months warranty"
        ]
    },

    // ----------------------------------------------------------
    // GPU (graphics cards)
    // ----------------------------------------------------------
    {
        id: "gc1",
        name: "ASUS Dual Radeon RX 7600 OC EVO 8GB GPU",
        brand: "ASUS",
        category: "GPU",
        categoryLabel: "Graphics Cards",
        price: 21999,
        was: 24999,
        image: "assets/Product img/GPU/gc1.png",
        stock: 5,
        description: "ASUS Dual Radeon RX 7600 OC EVO 8GB GDDR6 graphics card. PCI-E 4.0, 128-bit, 18 Gbps. Dual-fan axial-tech cooling. 12 months warranty.",
        specs: [
            "Memory: 8GB GDDR6",
            "Bus: PCI-E 4.0",
            "Speed: 18 Gbps",
            "Bus width: 128-bit",
            "Cooling: Dual fan axial-tech",
            "Outputs: HDMI 2.1 + 3x DisplayPort 1.4a",
            "12 months warranty"
        ]
    },

    {
        id: "gc2",
        name: "ASUS Dual GeForce RTX 3050 OC Edition 6GB GPU",
        brand: "ASUS",
        category: "GPU",
        categoryLabel: "Graphics Cards",
        price: 11999,
        was: 13999,
        image: "assets/Product img/GPU/gc2.png",
        stock: 10,
        description: "ASUS Dual GeForce RTX 3050 OC Edition 6GB GDDR6 graphics card featuring Auto-Extreme technology, dual axial-tech fans, and IP5X dust resistance. 12 months warranty.",
        specs: [
            "Memory: 6GB GDDR6",
            "Bus: PCI Express",
            "Cooling: Dual fan axial-tech with IP5X dust resistance",
            "Manufacturing: Auto-Extreme technology",
            "12 months warranty"
        ]
    },
    {
        id: "gc3",
        name: "ASUS Prime Radeon RX 7600 XT OC Edition 16GB GPU",
        brand: "ASUS",
        category: "GPU",
        categoryLabel: "Graphics Cards",
        price: 24999,
        was: 28999,
        image: "assets/Product img/GPU/gc3.png",
        stock: 4,
        description: "ASUS Prime Radeon RX 7600 XT OC Edition 16GB high-performance graphics card featuring a sleek triple-fan cooling solution and advanced thermal design. 12 months warranty.",
        specs: [
            "Memory: 16GB GDDR6",
            "Cooling: Triple-fan Prime design",
            "Edition: OC Edition",
            "12 months warranty"
        ]
    },
    {
        id: "gc4",
        name: "MSI GeForce RTX 4060 Shadow 2X OC 8GB GPU",
        brand: "MSI",
        category: "GPU",
        categoryLabel: "Graphics Cards",
        price: 18999,
        was: 21999,
        image: "assets/Product img/GPU/gc4.png",
        stock: 8,
        description: "MSI GeForce RTX 4060 Shadow 2X OC 8GB GDDR6 graphics card equipped with dual fans for efficient cooling and balanced gaming performance. 12 months warranty.",
        specs: [
            "Memory: 8GB GDDR6",
            "Cooling: Dual fan Shadow 2X design",
            "Edition: OC Edition",
            "12 months warranty"
        ]
    },

    // ----------------------------------------------------------
    // PSU (power supplies)
    // ----------------------------------------------------------
    {
        id: "pws1",
        name: "BOSSTON EK588 700W Power Supply",
        brand: "BOSSTON",
        category: "PSU",
        categoryLabel: "Power Supplies",
        price: 1899,
        was: 2499,
        image: "assets/Product img/PSU/pws1.png",
        stock: 22,
        description: "BOSSTON EK588 700W power supply with big-fan cooling. Good match for mid-range builds. 6 months warranty.",
        specs: [
            "Wattage: 700W",
            "Cooling: 120mm big fan",
            "Protections: OVP / UVP / OPP / SCP",
            "Connectors: 24-pin, 8-pin CPU, 6+2 PCIe, SATA x4",
            "6 months warranty"
        ]
    },

    {
        id: "pws2",
        name: "ASUS TUF Gaming 650W Bronze Power Supply",
        brand: "ASUS",
        category: "PSU",
        categoryLabel: "Power Supplies",
        price: 3699,
        was: 4399,
        image: "assets/Product img/PSU/pws2.png",
        stock: 15,
        description: "ASUS TUF Gaming 650W 80 PLUS Bronze certified power supply. Military-grade components and dual ball fan bearings for maximum durability. 12 months warranty.",
        specs: [
            "Wattage: 650W",
            "Certification: 80 PLUS Bronze",
            "Cooling: Dual ball fan bearings",
            "Components: Military-grade",
            "12 months warranty"
        ]
    },
    {
        id: "pws3",
        name: "Acer Gadget 650W Power Supply",
        brand: "Acer Gadget",
        category: "PSU",
        categoryLabel: "Power Supplies",
        price: 2899,
        was: 3499,
        image: "assets/Product img/PSU/pws3.png",
        stock: 18,
        description: "Acer Gadget 650W power supply featuring efficient cooling with a protective fan grill and stable power delivery for gaming builds. 12 months warranty.",
        specs: [
            "Wattage: 650W",
            "Cooling: Quiet fan with protective grill",
            "Stable power delivery",
            "12 months warranty"
        ]
    },
    {
        id: "pws4",
        name: "Acer eMachines AC750 750W Fully Modular Power Supply",
        brand: "Acer eMachines",
        category: "PSU",
        categoryLabel: "Power Supplies",
        price: 4299,
        was: 4999,
        image: "assets/Product img/PSU/pws4.png",
        stock: 10,
        description: "Acer eMachines AC750 750W 80 PLUS certified fully modular power supply for clean cable management and high-end system builds. 12 months warranty.",
        specs: [
            "Wattage: 750W",
            "Design: Fully modular",
            "Certification: 80 PLUS",
            "12 months warranty"
        ]
    },

    // ----------------------------------------------------------
    // COMPUTER CASES
    // ----------------------------------------------------------
    {
        id: "cs1",
        name: "ANTEC AX20 Elite Mid-Tower PC Case",
        brand: "ANTEC",
        category: "Case",
        categoryLabel: "Cases",
        price: 4799,
        was: 5999,
        image: "assets/Product img/Computer Case/cs1.png",
        stock: 7,
        description: "ANTEC AX20 Elite mid-tower ATX case with tempered-glass side panel and 4 pre-installed 120mm RGB fans. 6 months warranty.",
        specs: [
            "Form factor: Mid-Tower ATX",
            "Supports: ATX / Micro-ATX / ITX",
            "Side panel: 4mm tempered glass",
            "Material: SPCC steel + ABS plastic",
            "Pre-installed: 4x 120mm RGB fans",
            "Bottom magnetic dust filter",
            "6 months warranty"
        ]
    },

    {
        id: "cs2",
        name: "Montech Air 100 Lite Micro-ATX PC Case",
        brand: "Montech",
        category: "Case",
        categoryLabel: "Cases",
        price: 2699,
        was: 3299,
        image: "assets/Product img/Computer Case/cs2.png",
        stock: 12,
        description: "Montech Air 100 Lite compact micro-ATX PC case featuring high airflow mesh front panel, tempered glass side panel, and clean cable management. 6 months warranty.",
        specs: [
            "Form factor: Micro-ATX Tower",
            "Supports: Micro-ATX / Mini-ITX",
            "Side panel: Tempered glass",
            "Front panel: High airflow mesh design",
            "6 months warranty"
        ]
    },
    {
        id: "cs3",
        name: "MSI MAG PANO 100L PZ White Panoramic PC Case",
        brand: "MSI",
        category: "Case",
        categoryLabel: "Cases",
        price: 5499,
        was: 6499,
        image: "assets/Product img/Computer Case/cs3.png",
        stock: 6,
        description: "MSI MAG PANO 100L PZ White panoramic glass mid-tower chassis with back-connect motherboard support and expansive showcase view. 6 months warranty.",
        specs: [
            "Form factor: Mid-Tower",
            "Design: Panoramic tempered glass with Project Zero (PZ) back-connect support",
            "Color: White",
            "6 months warranty"
        ]
    },
    {
        id: "cs4",
        name: "Fractal Design Meshify C Blackout Tempered Glass PC Case",
        brand: "Fractal Design",
        category: "Case",
        categoryLabel: "Cases",
        price: 5899,
        was: 6999,
        image: "assets/Product img/Computer Case/cs4.png",
        stock: 8,
        description: "Fractal Design Meshify C Blackout ATX mid-tower case with angular mesh front ventilation and dark tinted tempered glass side panel. 6 months warranty.",
        specs: [
            "Form factor: Mid-Tower ATX",
            "Supports: ATX / Micro-ATX / ITX",
            "Side panel: Dark tinted tempered glass",
            "Front panel: Angular mesh for high airflow",
            "Color: Blackout",
            "6 months warranty"
        ]
    },

    // ----------------------------------------------------------
    // COOLING SYSTEMS
    // ----------------------------------------------------------
    {
        id: "clr",
        name: "1STPLAYER CC240 ARGB AIO Liquid Cooler",
        brand: "1STPLAYER",
        category: "CoolingSystem",
        categoryLabel: "Cooling",
        price: 6499,
        was: 7999,
        image: "assets/Product img/Cooling System/clr.png",
        stock: 6,
        description: "1STPLAYER CC240 ARGB 240mm AIO liquid cooler with temperature display and copper endothermic cold plate. 6 months warranty.",
        specs: [
            "Radiator: 240mm",
            "Pump: ARGB with temperature display",
            "Cold plate: Copper endothermic",
            "TDP support: up to 250W",
            "Compatibility: Intel LGA1700/1200, AMD AM4/AM5",
            "6 months warranty"
        ]
    },

    {
        id: "clr1",
        name: "ARCTIC Liquid Freezer III 280 A-RGB Black Liquid Cooler",
        brand: "ARCTIC",
        category: "CoolingSystem",
        categoryLabel: "Cooling",
        price: 5899,
        was: 6999,
        image: "assets/Product img/Cooling System/clr1.png",
        stock: 5,
        description: "ARCTIC Liquid Freezer III 280 A-RGB liquid CPU cooler with VRM cooling fan, P-fans, and MX-6 thermal paste included. 12 months warranty.",
        specs: [
            "Radiator: 280mm",
            "Features: VRM cooling fan on pump block",
            "Fans: P-fans optimized for static pressure",
            "Compatibility: Intel LGA1700, AMD AM4/AM5",
            "12 months warranty"
        ]
    },
    {
        id: "clr2",
        name: "Cooler Master MasterLiquid 360 Atmos AIO Liquid Cooler",
        brand: "Cooler Master",
        category: "CoolingSystem",
        categoryLabel: "Cooling",
        price: 7999,
        was: 9499,
        image: "assets/Product img/Cooling System/clr2.png",
        stock: 4,
        description: "Cooler Master MasterLiquid 360 Atmos ARGB AIO liquid cooler featuring customizable pump cap design, dual-chamber pump, and high-performance fans. 12 months warranty.",
        specs: [
            "Radiator: 360mm",
            "Pump: Dual-chamber with customizable top cover",
            "Fans: ARGB high-performance fans",
            "Compatibility: Broad Intel & AMD support",
            "12 months warranty"
        ]
    },
    {
        id: "clr3",
        name: "DarkFlash DX240 V2.6 Digital Display ARGB Liquid Cooler",
        brand: "DarkFlash",
        category: "CoolingSystem",
        categoryLabel: "Cooling",
        price: 4599,
        was: 5499,
        image: "assets/Product img/Cooling System/clr3.png",
        stock: 9,
        description: "DarkFlash DX240 V2.6 AIO liquid cooler equipped with a real-time digital temperature display pump block and vibrant ARGB fans. 6 months warranty.",
        specs: [
            "Radiator: 240mm",
            "Pump: Real-time digital temperature/status display",
            "Lighting: ARGB synchronization",
            "Compatibility: Modern Intel and AMD sockets",
            "6 months warranty"
        ]
    },

    // ----------------------------------------------------------
    // PERIPHERALS (keyboard, mouse, monitor...)
    // ----------------------------------------------------------
    {
        id: "mon1",
        name: "ASUS ROG Strix XG27ACMES 27\" 255Hz QHD Monitor",
        brand: "ASUS ROG",
        category: "Peripheral",
        categoryLabel: "Peripherals",
        price: 34999,
        was: 38999,
        image: "assets/Product img/Peripheral/mon1.png",
        stock: 4,
        description: "ASUS ROG Strix XG27ACMES 27-inch 2560x1440 255Hz (OC) 0.3ms Fast IPS gaming monitor. G-SYNC compatible, USB Type-C. 12 months warranty.",
        specs: [
            "Size: 27\"",
            "Resolution: 2560 x 1440 (QHD)",
            "Refresh rate: 255Hz OC (above 144Hz)",
            "Response time: 0.3ms Fast IPS",
            "Adaptive sync: G-SYNC compatible",
            "USB Type-C input",
            "12 months warranty"
        ]
    },

    {
        id: "k1",
        name: "AULA AU75 Glacier Blue Wireless Mechanical Keyboard",
        brand: "AULA",
        category: "Peripheral",
        categoryLabel: "Peripherals",
        price: 4499,
        was: 5499,
        image: "assets/Product img/Peripheral/k1.png",
        stock: 8,
        description: "AULA AU75 75% layout 81-key wireless mechanical keyboard. Tri-mode connection (2.4G / BT / USB-C), RGB backlight, hot-swappable Star Vector switches, PBT keycaps, gasket mount. 6 months warranty.",
        specs: [
            "Layout: 75% / 81 keys",
            "Color: Glacier Blue",
            "Connection: Tri-mode 2.4G / Bluetooth / USB-C",
            "Backlight: Per-key RGB",
            "Switches: Star Vector hot-swappable",
            "Keycaps: PBT double-shot",
            "Mount: Gasket for soft typing feel",
            "6 months warranty"
        ]
    },

    {
        id: "mpd1",
        name: "COUGAR Arena X Pink Gaming Mousepad",
        brand: "COUGAR",
        category: "Peripheral",
        categoryLabel: "Peripherals",
        price: 1899,
        was: 2499,
        image: "assets/Product img/Peripheral/mpd1.png",
        stock: 14,
        description: "COUGAR Arena X pink RGB gaming mousepad. Wide cloth surface, anti-slip base, RGB edge lighting with 3 modes. 12 months warranty.",
        specs: [
            "Surface: Cloth with anti-slip rubber base",
            "Size: 900 x 400 mm",
            "Thickness: 4 mm",
            "RGB edge lighting with 3 modes",
            "12 months warranty"
        ]
    },

    {
        id: "mce1",
        name: "Honeycomb Ultra-Light Gaming Mouse",
        brand: "J&J Pick",
        category: "Peripheral",
        categoryLabel: "Peripherals",
        price: 1299,
        was: 1899,
        image: "assets/Product img/Peripheral/mce1.png",
        stock: 11,
        description: "Ultra-light honeycomb-shell gaming mouse at under 65g. 16,000 DPI optical sensor, 6 programmable buttons, RGB underglow. 6 months warranty.",
        specs: [
            "Design: Honeycomb shell (under 65g)",
            "Sensor: 16,000 DPI optical",
            "Buttons: 6 programmable",
            "RGB underglow",
            "Cable: 1.8 m braided USB",
            "6 months warranty"
        ]
    }
];

// ================================================================
// 3) peso()  --  MONEY FORMATTER
// ----------------------------------------------------------------
// peso(13499)  ->  "₱13,499"
// toLocaleString("en-PH") adds the commas the Philippine way.
// Used by app.js everywhere a price is shown.
// ================================================================
function peso(n) {
    return "₱" + n.toLocaleString("en-PH");
}