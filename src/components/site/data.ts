export type Room = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  maxGuests: number;
  bed: string;
  size: number;
  price: number;
  images: string[];
  amenities: string[];
};

export const ROOMS: Room[] = [
  {
    id: "studio",
    name: "Studio Room",
    description: "A bright, open-plan studio with a cozy queen bed, kitchenette, and city views.",
    longDescription:
      "The Studio Room is a thoughtfully designed open-plan space with a plush queen bed, compact kitchenette, modern bathroom, and large windows that fill the room with natural light. Ideal for solo travelers or couples who want a clean, minimalist retreat.",
    maxGuests: 2,
    bed: "1 Queen Bed",
    size: 320,
    price: 85,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
    ],
    amenities: ["Queen bed", "Kitchenette", "Ensuite bathroom", "Smart TV", "Air conditioning", "Workspace"],
  },
  {
    id: "one-bedroom",
    name: "One Bedroom",
    description: "A private bedroom with a king bed, separate living area, and a full kitchen.",
    longDescription:
      "The One Bedroom is a true home away from home: a private king bedroom, separate living room with a sofa, a full kitchen for home-cooked meals, and a modern bathroom. Perfect for guests who want extra space, comfort, and privacy.",
    maxGuests: 3,
    bed: "1 King Bed",
    size: 480,
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1600&q=80",
    ],
    amenities: ["King bed", "Separate living room", "Full kitchen", "Ensuite bathroom", "Smart TV", "Air conditioning"],
  },
];

export type Review = {
  id: string;
  name: string;
  flag: string;
  rating: number;
  date: string;
  text: string;
};

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Amelia Carter",
    flag: "🇬🇧",
    rating: 5,
    date: "Stayed March 2025",
    text:
      "Honestly the best Airbnb we've ever booked. The pool was sparkling, the kitchen had everything we needed for our anniversary dinner, and our host replied within minutes whenever we messaged. Already planning our next trip back.",
  },
  {
    id: "r2",
    name: "Daniel Okonkwo",
    flag: "🇳🇬",
    rating: 5,
    date: "Stayed February 2025",
    text:
      "Quiet street, five minutes to the supermarket and a beautiful garden to unwind in after long days. The master suite is genuinely luxurious — felt like a boutique hotel, not a rental.",
  },
  {
    id: "r3",
    name: "Sofia Martinez",
    flag: "🇪🇸",
    rating: 4,
    date: "Stayed January 2025",
    text:
      "Stunning home and the location is unbeatable — walked to dinner most nights. The BBQ grill on the patio was the highlight for our group. Would absolutely stay again.",
  },
];
