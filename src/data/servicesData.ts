export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tagline?: string;
  detailedSpecs?: string[];
  recommendedMaterials?: string[];
  category?: string;
}

/**
 * Sunil Carpentry Works Services Showcase
 * All real images extracted from the workshop portfolio
 */
export const servicesData: ServiceItem[] = [
  {
    id: "main-doors",
    title: "Main Doors & Carved Entrances",
    description:
      "Solid wood entrance doors, traditional carved pooja doors, modern fluted panels and heavy teak frames built for durability and elegance.",
    image: "/assets/services/service-main-doors.jpg",
    category: "doors",
    tagline: "Solid Teak & Hand-Carved Joinery",
  },
  {
    id: "wardrobes-storage",
    title: "Fitted Wardrobes & Lofts",
    description:
      "Floor-to-ceiling sliding wardrobes, walk-in closets, dresser units, loft cabinets, and hydraulic internal fittings designed to fit your room perfectly.",
    image: "/assets/services/service-wardrobes.jpg",
    category: "wardrobes",
    tagline: "Custom Internal Storage & Sliding Doors",
  },
  {
    id: "modular-kitchens",
    title: "Modular Kitchen Woodwork",
    description:
      "Kitchen cabinetry, breakfast counters, tandem drawers, bottle pull-outs, and waterproof BWP marine ply carcass designed for daily Indian cooking.",
    image: "/assets/services/service-modular-kitchen.jpg",
    category: "kitchens",
    tagline: "100% BWP Marine Ply & Acrylic Finishes",
  },
  {
    id: "tv-units-cabinets",
    title: "TV Units & Wall Paneling",
    description:
      "Living room entertainment consoles, marble-finish accent backdrops, acoustic fluted slats, and warm LED cove lighting built to order.",
    image: "/assets/services/service-tv-units.jpg",
    category: "tv-units",
    tagline: "Floating Consoles & Acoustic Wooden Slats",
  },
  {
    id: "pooja-units",
    title: "Pooja Units & Mandirs",
    description:
      "Dedicated prayer room woodwork, illuminated laser-cut Om back panels, warm ambient lighting, stepped altar base, floating shelves, and storage drawers.",
    image: "/assets/services/service-pooja-units.jpg",
    category: "pooja-units",
    tagline: "Sacred Om Jaali, Stepped Altar & LED Lighting",
  },
  {
    id: "wooden-windows",
    title: "Wooden Windows & Shutters",
    description:
      "Window frames, louvers, sliding balcony wooden partitions, glass-inset shutters, and wooden grill woodwork built for natural light and ventilation.",
    image: "/assets/services/service-wooden-windows.jpg",
    category: "wooden-windows",
    tagline: "Weatherproof Frames & Traditional Louvers",
  },
  {
    id: "staircase-ceilings",
    title: "Staircases, Railings & Ceilings",
    description:
      "Solid timber handrails, glass railings, illuminated floating staircases, and wooden false ceilings with warm cove lighting.",
    image: "/assets/services/service-staircase-ceilings.jpg",
    category: "interior-work",
    tagline: "Architectural Woodwork & Glass Accents",
  },
  {
    id: "custom-furniture",
    title: "Custom Furniture & Studies",
    description:
      "King and queen bed frames with hydraulic storage, ergonomic study desks, reception counters, and bespoke dining furniture.",
    image: "/assets/services/service-custom-furniture.jpg",
    category: "furniture",
    tagline: "Made-to-Measure Solid Wood & Engineered Ply",
  },
];
