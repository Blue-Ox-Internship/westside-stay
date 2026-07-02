import type { Review } from "@/components/site/data";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type BookingPayload = {
  name: string;
  email: string;
  phone: string;
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
