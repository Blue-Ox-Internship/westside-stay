import { pool } from "../src/db.js";

const rooms = [
  {
    id: "studio",
    name: "Studio Room",
    description: "A bright spacious open studio room with a queen-size bed, kitchen and bathroom.",
    long_description:
      "The Studio Room is a thoughtfully designed open-plan space with a plush queen bed, compact kitchenette, modern bathroom, and large windows that fill the room with natural light. Ideal for solo travelers or couples who want a clean, minimalist retreat.",
    max_guests: 2,
    bed: "1 Queen Bed",
    size: 320,
    price: 27.8,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
    ],
    video: "https://res.cloudinary.com/fvcek1lo/video/upload/v1782980081/westside-stay/rooms/studio-room.mov",
    amenities: ["Queen bed", "Kitchenette", "Ensuite bathroom", "Smart TV", "Air conditioning", "Workspace"],
    sort_order: 0,
  },
  {
    id: "one-bedroom",
    name: "One Bedroom",
    description:
      "A separated cozy bedroom with a kingsize bed, seperate living area, fully equipped kitchen and full bathroom.",
    long_description:
      "The One Bedroom is a true home away from home: a private king bedroom, separate living room with a sofa, a full kitchen for home-cooked meals, and a modern bathroom. Perfect for guests who want extra space, comfort, and privacy.",
    max_guests: 2,
    bed: "1 King Bed",
    size: 480,
    price: 40.9,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1600&q=80",
    ],
    video: "https://res.cloudinary.com/fvcek1lo/video/upload/v1782980113/westside-stay/rooms/one-bedroom.mov",
    amenities: ["King bed", "Separate living room", "Full kitchen", "Ensuite bathroom", "Smart TV", "Air conditioning"],
    sort_order: 1,
  },
];

const content = {
  hero_slogan: "Where comfort meets home!",
  contact_email: "thewestside2025@gmail.com",
  contact_phone: "+256 769 042 430",
  whatsapp_number: "256769042430",
  instagram_url: "https://www.instagram.com/t.h.e.westside",
  tiktok_url: "https://www.tiktok.com/@thewestside_apartments",
  address_line1: "Matari Drive, Ruharo Rd",
  address_city: "Mbarara, Uganda",
  proximity_stats: [
    { time: "10 min", label: "to City Centre" },
    { time: "5 min", label: "to Supermarket" },
    { time: "5 min", label: "to Restaurants" },
  ],
  why_choose_us: [
    {
      title: "Prime Location",
      desc: "A stone's throw from top restaurants and supermarkets. Get all your needs at your doorstep without sacrificing your peace and quiet.",
    },
    {
      title: "Entire Place to Yourself",
      desc: "No shared rooms and no surprise guests. The whole room, kitchen — is exclusively yours.",
    },
    {
      title: "Dedicated Host Support",
      desc: "We're always a message away. From local recommendations to last-minute requests, your host has you covered, 24/7.",
    },
  ],
};

for (const room of rooms) {
  await pool.query(
    `INSERT INTO rooms (id, name, description, long_description, max_guests, bed, size, price, images, video, amenities, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (id) DO NOTHING`,
    [
      room.id,
      room.name,
      room.description,
      room.long_description,
      room.max_guests,
      room.bed,
      room.size,
      room.price,
      JSON.stringify(room.images),
      room.video,
      JSON.stringify(room.amenities),
      room.sort_order,
    ]
  );
}

for (const [key, value] of Object.entries(content)) {
  await pool.query(
    `INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
    [key, JSON.stringify(value)]
  );
}

console.log("Seeded rooms and site_content.");
await pool.end();
