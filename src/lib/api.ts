import type { Review, Room } from "@/components/site/data";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// Room videos are uploaded straight from phones, often as HEVC-encoded .mov
// files that many browsers (esp. Chrome on Windows) can't decode cleanly.
// Ask Cloudinary to transcode to a browser-appropriate format at delivery
// time instead of serving the raw upload.
export function optimizedVideoUrl(url: string): string {
  return url.replace("/video/upload/", "/video/upload/q_auto,f_auto/");
}

export type BookingPayload = {
  name: string;
  phone: string;
  email: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  requests?: string;
};

export async function createBooking(payload: BookingPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Failed to submit booking request.");
  }
}

export type BookedRange = { checkIn: string; checkOut: string };

export async function fetchAvailability(roomId: string): Promise<BookedRange[]> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/availability?roomId=${encodeURIComponent(roomId)}`);
  if (!res.ok) throw new Error("Failed to load availability.");
  const rows: { check_in: string; check_out: string }[] = await res.json();
  return rows.map((r) => ({ checkIn: r.check_in, checkOut: r.check_out }));
}

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  requests: string | null;
  status: "pending" | "confirmed" | "cancelled";
  unit_label: string | null;
  created_at: string;
};

export async function fetchAllBookings(adminPassword: string): Promise<Booking[]> {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    headers: { "x-admin-password": adminPassword },
  });
  if (res.status === 401) throw new Error("Incorrect password.");
  if (!res.ok) throw new Error("Failed to load bookings.");
  return res.json();
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  adminPassword: string,
  unitLabel?: string
): Promise<Booking> {
  const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-password": adminPassword },
    body: JSON.stringify({ status, unitLabel }),
  });
  if (res.status === 401) throw new Error("Incorrect password.");
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Failed to update booking.");
  }
  return res.json();
}

type RoomRow = {
  id: string;
  name: string;
  description: string;
  long_description: string;
  max_guests: number;
  bed: string;
  size: number;
  price: string;
  images: string[];
  videos: string[];
  amenities: string[];
  sort_order: number;
  units: string[];
};

function toRoom(row: RoomRow): Room {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    maxGuests: row.max_guests,
    bed: row.bed,
    size: row.size,
    price: parseFloat(row.price),
    images: row.images,
    videos: row.videos,
    amenities: row.amenities,
    units: row.units,
  };
}

export async function fetchRooms(): Promise<Room[]> {
  const res = await fetch(`${API_BASE_URL}/api/rooms`);
  if (!res.ok) throw new Error("Failed to load rooms.");
  const rows: RoomRow[] = await res.json();
  return rows.map(toRoom);
}

export async function updateRoom(id: string, room: Room, adminPassword: string): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-password": adminPassword },
    body: JSON.stringify({
      name: room.name,
      description: room.description,
      longDescription: room.longDescription,
      maxGuests: room.maxGuests,
      bed: room.bed,
      size: room.size,
      price: room.price,
      images: room.images,
      videos: room.videos,
      amenities: room.amenities,
      units: room.units,
    }),
  });
  if (res.status === 401) throw new Error("Incorrect password.");
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Failed to update room.");
  }
  return toRoom(await res.json());
}

export type SiteContent = {
  hero_slogan: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  instagram_url: string;
  tiktok_url: string;
  airbnb_url: string;
  address_line1: string;
  address_city: string;
  proximity_stats: { time: string; label: string }[];
  why_choose_us: { title: string; desc: string }[];
  exterior: { description: string; images: string[]; videos: string[] };
  payment_methods: { name: string; details: string }[];
};

export async function fetchContent(): Promise<Partial<SiteContent>> {
  const res = await fetch(`${API_BASE_URL}/api/content`);
  if (!res.ok) throw new Error("Failed to load site content.");
  return res.json();
}

export async function updateContent(
  content: Partial<SiteContent>,
  adminPassword: string
): Promise<Partial<SiteContent>> {
  const res = await fetch(`${API_BASE_URL}/api/content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-password": adminPassword },
    body: JSON.stringify(content),
  });
  if (res.status === 401) throw new Error("Incorrect password.");
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Failed to update site content.");
  }
  return res.json();
}

export async function getCloudinarySignature(adminPassword: string, folder?: "rooms" | "exterior") {
  const query = folder ? `?folder=${folder}` : "";
  const res = await fetch(`${API_BASE_URL}/api/cloudinary/signature${query}`, {
    headers: { "x-admin-password": adminPassword },
  });
  if (res.status === 401) throw new Error("Incorrect password.");
  if (!res.ok) throw new Error("Failed to get upload signature.");
  return res.json() as Promise<{
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
  }>;
}

export async function uploadToCloudinary(
  file: File,
  adminPassword: string,
  resourceType: "image" | "video",
  folder?: "rooms" | "exterior"
): Promise<string> {
  const { timestamp, signature, apiKey, cloudName, folder: uploadFolder } = await getCloudinarySignature(
    adminPassword,
    folder
  );
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", uploadFolder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload to Cloudinary failed.");
  const data = await res.json();
  return data.secure_url as string;
}

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
};

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    flag: "🌍",
    rating: row.rating,
    date: `Stayed ${new Date(row.created_at).toLocaleString("default", { month: "long", year: "numeric" })}`,
    text: row.text,
  };
}

export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/api/reviews`);
  if (!res.ok) throw new Error("Failed to load reviews.");
  const rows: ReviewRow[] = await res.json();
  return rows.map(toReview);
}

export async function createReview(payload: { name: string; rating: number; text: string }): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Failed to submit review.");
  }
  return toReview(await res.json());
}
