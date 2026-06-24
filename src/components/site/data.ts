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
    id: "master",
    name: "Master Bedroom Suite",
    description: "King-size sanctuary with private balcony, plush linens and a spa-style ensuite.",
    longDescription:
      "Wake up to soft morning light in our flagship suite. A king bed dressed in Egyptian cotton, a private balcony overlooking the gardens, and a marble ensuite with a rainfall shower make this the most coveted room in the house.",
    maxGuests: 2,
    bed: "1 King Bed",
    size: 420,
    price: 145,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
    ],
    amenities: ["King bed", "Private balcony", "Ensuite bathroom", "Smart TV", "Air conditioning", "Workspace"],
  },
  {
    id: "twin",
    name: "Twin Garden Room",
    description: "Two cozy beds, garden views, perfect for friends or siblings traveling together.",
    longDescription:
      "Bright and airy with views straight onto the patio garden, the Twin Room is built for easy companionship — twin beds, generous storage and a sunlit reading nook.",
    maxGuests: 2,
    bed: "2 Twin Beds",
    size: 280,
    price: 95,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80",
    ],
    amenities: ["2 twin beds", "Garden view", "Shared bathroom", "Air conditioning", "Closet", "Reading nook"],
  },
  {
    id: "living",
    name: "Living Room Suite",
    description: "A pull-out king sleeper, lounge area and entertainment wall — bring the family.",
    longDescription:
      "Our flexible living suite doubles as a generous lounge by day and a private sleeping space by night with a premium pull-out king bed, surround sound and a 65\" smart TV.",
    maxGuests: 3,
    bed: "1 King Sleeper Sofa",
    size: 520,
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1600&q=80",
    ],
    amenities: ["King sleeper sofa", '65" Smart TV', "Surround sound", "Mini bar", "Air conditioning"],
  },
  {
    id: "garden",
    name: "Garden View Room",
    description: "A peaceful queen room with French doors that open onto the patio and pool.",
    longDescription:
      "Step straight from your room to the pool. French doors, a queen bed and a private vanity make this room a guest favorite for couples seeking a quiet retreat.",
    maxGuests: 2,
    bed: "1 Queen Bed",
    size: 310,
    price: 110,
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1551776235-dde6d482980b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    ],
    amenities: ["Queen bed", "Pool access", "French doors", "Vanity", "Air conditioning", "Smart TV"],
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
