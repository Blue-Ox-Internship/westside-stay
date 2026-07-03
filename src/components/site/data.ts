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
  videos: string[];
  amenities: string[];
  unitCount: number;
};

export const ROOMS: Room[] = [
  {
    id: "studio",
    name: "Studio Room",
    description: "A bright spacious open studio room with a queen-size bed, kitchen and bathroom.",
    longDescription:
      "The Studio Room is a thoughtfully designed open-plan space with a plush queen bed, compact kitchenette, modern bathroom, and large windows that fill the room with natural light. Ideal for solo travelers or couples who want a clean, minimalist retreat.",
    maxGuests: 2,
    bed: "1 Queen Bed",
    size: 320,
    price: 27.8,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
    ],
    videos: ["https://res.cloudinary.com/fvcek1lo/video/upload/v1782980081/westside-stay/rooms/studio-room.mov"],
    amenities: ["Queen bed", "Kitchenette", "Ensuite bathroom", "Smart TV", "Air conditioning", "Workspace"],
    unitCount: 1,
  },
  {
    id: "one-bedroom",
    name: "One Bedroom",
    description: "A separated cozy bedroom with a kingsize bed, seperate living area, fully equipped kitchen and full bathroom.",
    longDescription:
      "The One Bedroom is a true home away from home: a private king bedroom, separate living room with a sofa, a full kitchen for home-cooked meals, and a modern bathroom. Perfect for guests who want extra space, comfort, and privacy.",
    maxGuests: 2,
    bed: "1 King Bed",
    size: 480,
    price: 40.9,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1600&q=80",
    ],
    videos: ["https://res.cloudinary.com/fvcek1lo/video/upload/v1782980113/westside-stay/rooms/one-bedroom.mov"],
    amenities: ["King bed", "Separate living room", "Full kitchen", "Ensuite bathroom", "Smart TV", "Air conditioning"],
    unitCount: 1,
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
    name: "A. Mary Vanessa",
    flag: "🇷🇼",
    rating: 5,
    date: "Stayed April 2026",
    text:
      "Honestly this was the best Airbnb i have ever booked. The environment was exactly as described; very clean, comfortable, beautifully designed and equipped with everything I needed. The location was convenient and the host was incredibly welcoming and responsive throughout my stay. Check-in and check-out were seamless making the entire experience stress-free. I am so planning to stay here again very soon and I highly recommend this place to anyone looking for a comfortable and peaceful stay.",
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
