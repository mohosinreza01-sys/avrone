export const products = [
  {
    id: "avr-001",
    slug: "signature-textured-panjabi",
    name: "Signature Textured Panjabi",
    category: "Panjabi",
    brand: "AVRONE Signature",
    price: 2890,
    compareAtPrice: 3490,
    badge: "Bestseller",
    color: "Deep olive",
    sizes: ["38", "40", "42", "44", "46"],
    image:
      "https://images.unsplash.com/photo-1767775498862-d4740ce574ce?auto=format&fit=crop&w=1000&q=80",
    description:
      "A refined everyday Panjabi with a clean silhouette, subtle texture, and an easy fit for gatherings and special occasions.",
  },
  {
    id: "avr-002",
    slug: "classic-cotton-panjabi",
    name: "Classic Cotton Panjabi",
    category: "Panjabi",
    brand: "AVRONE Signature",
    price: 2390,
    badge: "Everyday classic",
    color: "Soft ivory",
    sizes: ["38", "40", "42", "44", "46"],
    image:
      "https://images.unsplash.com/photo-1774527929835-282b1b85cd3a?auto=format&fit=crop&w=1000&q=80",
    description:
      "A breathable cotton Panjabi with understated detailing and a relaxed, comfortable fit for everyday wear.",
  },
  {
    id: "avr-003",
    slug: "premium-embroidered-panjabi",
    name: "Premium Embroidered Panjabi",
    category: "Panjabi",
    brand: "AVRONE Signature",
    price: 4290,
    badge: "Occasion wear",
    color: "Warm sand",
    sizes: ["38", "40", "42", "44", "46"],
    image:
      "https://images.unsplash.com/photo-1774267230662-575d1f4ec1bd?auto=format&fit=crop&w=1000&q=80",
    description:
      "A polished occasion-ready Panjabi with considered embroidery, a comfortable fit, and a timeless finish.",
  },
  {
    id: "avr-004",
    slug: "everyday-casual-panjabi",
    name: "Everyday Casual Panjabi",
    category: "Panjabi",
    brand: "AVRONE Everyday",
    price: 2590,
    color: "Midnight blue",
    sizes: ["38", "40", "42", "44", "46"],
    image:
      "https://images.unsplash.com/photo-1770359993283-a2c2f386584e?auto=format&fit=crop&w=1000&q=80",
    description:
      "An easy-to-wear Panjabi with a clean collar and versatile styling, made for relaxed plans and family occasions.",
  },
  {
    id: "avr-005",
    slug: "everyday-cotton-shirt",
    name: "Everyday Cotton Shirt",
    category: "Shirts",
    brand: "AVRONE Everyday",
    price: 1890,
    badge: "New",
    color: "Classic white",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1000&q=80",
    description:
      "A versatile cotton shirt with a neat fit and easy styling, suited to workdays, outings, and everyday wear.",
  },
  {
    id: "avr-006",
    slug: "premium-casual-shirt",
    name: "Premium Casual Shirt",
    category: "Shirts",
    brand: "AVRONE Studio",
    price: 2290,
    badge: "New",
    color: "Charcoal",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=1000&q=80",
    description:
      "A smart-casual shirt with a contemporary shape and considered details, easy to dress up or down.",
  },
  {
    id: "avr-007",
    slug: "relaxed-cotton-pajama",
    name: "Relaxed Cotton Pajama",
    category: "Bottomwear",
    brand: "AVRONE Essentials",
    price: 1290,
    badge: "New",
    color: "Natural beige",
    sizes: ["M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1645944692361-721984d57b6c?auto=format&fit=crop&w=1000&q=80",
    description:
      "Soft, breathable cotton pajama bottoms with a relaxed fit for all-day ease and comfortable lounging.",
  },
  {
    id: "avr-008",
    slug: "woven-leather-belt",
    name: "Woven Leather Belt",
    category: "Accessories",
    brand: "AVRONE Studio",
    price: 1490,
    badge: "New",
    color: "Dark brown",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1711443982852-b3df5c563448?auto=format&fit=crop&w=1000&q=80",
    description:
      "A versatile woven belt with a classic finish, designed to complete everyday and occasion looks.",
  },
];

export const formatPrice = (amount) =>
  `৳${new Intl.NumberFormat("en-BD").format(amount)}`;

export const collectionSlugs = {
  Panjabi: "panjabi",
  Shirts: "shirts",
  Bottomwear: "bottomwear",
  Accessories: "accessories",
};
