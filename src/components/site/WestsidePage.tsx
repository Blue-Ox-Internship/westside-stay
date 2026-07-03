import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Wifi,
  Waves,
  ChefHat,
  Car,
  Wind,
  Tv,
  WashingMachine,
  Trees,
  Flame,
  ShieldCheck,
  KeyRound,
  PawPrint,
  MapPin,
  Star,
  Menu,
  X,
  ArrowUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Sparkles,
  Home as HomeIcon,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROOMS, SAMPLE_REVIEWS, type Room, type Review } from "./data";
import {
  createBooking,
  createReview,
  fetchAvailability,
  fetchContent,
  fetchReviews,
  fetchRooms,
  optimizedVideoUrl,
  type SiteContent,
} from "@/lib/api";

const DEFAULT_CONTENT: SiteContent = {
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

type SiteData = { rooms: Room[]; content: SiteContent };
const SiteDataContext = createContext<SiteData>({ rooms: ROOMS, content: DEFAULT_CONTENT });
function useSiteData() {
  return useContext(SiteDataContext);
}

/* ---------------- NAVBAR ---------------- */
const NAV_LINKS = [
  { href: "#rooms", label: "Rooms" },
  { href: "#amenities", label: "Amenities" },
  { href: "#offer", label: "What We Offer" },
  { href: "#location", label: "Location" },
  { href: "#booking", label: "Book Now" },
  { href: "#reviews", label: "Reviews" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center">
          <img
            src="/logo.png"
            alt="The Westside Airbnb"
            className="h-20 w-auto object-contain sm:h-24 brightness-0 invert"
          />
        </a>
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${scrolled ? "text-foreground/80" : "text-white drop-shadow-md"
                  }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:block">
          <a href="#booking">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Book Now</Button>
          </a>
        </div>
        <button
          aria-label="Toggle menu"
          className={`rounded-md p-2 lg:hidden ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <ul className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const { content } = useSiteData();
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/main.jpeg)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          THE WESTSIDE
          <br />
          <span className="text-[var(--gold)]">AIRBNB</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/85 sm:text-lg md:text-xl">{content.hero_slogan}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#booking">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[var(--gold)] px-8 text-base font-semibold text-[var(--gold-foreground)] shadow-xl hover:bg-[var(--gold)]/90"
            >
              Book Your Stay
            </Button>
          </a>
          <a href="#rooms">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-white/5 px-8 text-base text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
            >
              Explore Rooms
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SECTION HEADING ---------------- */
function SectionHeading({ eyebrow, title, kicker }: { eyebrow?: string; title: string; kicker?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl font-bold text-primary sm:text-5xl">{title}</h2>
      {kicker && <p className="mt-4 text-base text-muted-foreground">{kicker}</p>}
    </div>
  );
}

/* ---------------- ROOMS ---------------- */
function RoomCard({ room, onView }: { room: Room; onView: (r: Room) => void }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        {room.videos[0] ? (
          <video
            src={optimizedVideoUrl(room.videos[0])}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <img
            src={room.images[0]}
            alt={room.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute right-3 top-3 rounded-full bg-background/95 px-3 py-1 text-sm font-semibold text-primary shadow-md">
          ${room.price}
          <span className="text-xs font-normal text-muted-foreground"> / night</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-semibold text-primary">{room.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground/70">
          <span>👥 Up to {room.maxGuests} guests</span>
          <span>🛏 {room.bed}</span>
        </div>
        <Button
          onClick={() => onView(room)}
          variant="outline"
          className="mt-5 w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          View Room
        </Button>
      </div>
    </article>
  );
}

function RoomModal({
  room,
  onClose,
  onBook,
}: {
  room: Room | null;
  onClose: () => void;
  onBook: (id: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [room?.id]);
  if (!room) return null;
  const media = [
    ...room.videos.map((url) => ({ type: "video" as const, url })),
    ...room.images.map((url) => ({ type: "image" as const, url })),
  ];
  const total = media.length;
  const current = media[idx];
  return (
    <Dialog open={!!room} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {current?.type === "video" ? (
            <video
              key={current.url}
              src={optimizedVideoUrl(current.url)}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={current?.url} alt={room.name} className="h-full w-full object-cover" />
          )}
          {total > 1 && (
            <>
              <button
                onClick={() => setIdx((i) => (i - 1 + total) % total)}
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md hover:bg-background"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIdx((i) => (i + 1) % total)}
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground shadow-md hover:bg-background"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {media.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-primary">{room.name}</DialogTitle>
            <DialogDescription className="text-base">{room.longDescription}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground/80">
            <span>👥 Up to {room.maxGuests} guests</span>
            <span>🛏 {room.bed}</span>
            <span className="font-semibold text-accent">${room.price} / night</span>
          </div>
          <div className="mt-6">
            <h4 className="mb-2 font-display text-lg font-semibold text-primary">Room amenities</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-foreground/80">
              {room.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              onBook(room.id);
              onClose();
            }}
          >
            Book This Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RoomsSection({
  onViewRoom,
}: {
  onViewRoom: (r: Room) => void;
}) {
  const { rooms } = useSiteData();
  return (
    <section id="rooms" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where you'll stay"
          title="Our Rooms"
          kicker="Two distinct rooms, each thoughtfully styled for rest, work and play."
        />
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} onView={onViewRoom} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- AMENITIES ---------------- */
const AMENITIES = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: ChefHat, label: "Full Kitchen" },
  { icon: Car, label: "Free Parking" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Tv, label: "Smart TV" },
  { icon: WashingMachine, label: "Washing Machine" },
  { icon: Trees, label: "Mini-garden" },
  { icon: KeyRound, label: "24/7 Self Check-in" },
];

function AmenitiesSection() {
  return (
    <section id="amenities" className="section-pad bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What's included"
          title="Amenities"
          kicker="Everything you will need for a modern, comfortable, relaxed, effortless and memorable stay"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {AMENITIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-md"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHAT WE OFFER ---------------- */
const WHY_CHOOSE_US_ICONS = [MapPin, HomeIcon, Heart];

function WhatWeOfferSection() {
  const { content } = useSiteData();
  const cards = content.why_choose_us.map((c, i) => ({
    ...c,
    icon: WHY_CHOOSE_US_ICONS[i] ?? MapPin,
  }));
  return (
    <section id="offer" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Why guests come back" title="Why Choose Us" />
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-lg"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-primary">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-3xl text-center text-base italic text-foreground/75">
          At The Westside Airbnb, we go beyond just providing a place to sleep. We craft an experience — clean,
          comfortable, and curated just for you.
        </p>
      </div>
    </section>
  );
}

/* ---------------- LOCATION ---------------- */
function LocationSection() {
  const { content } = useSiteData();
  const fullAddress = `${content.address_line1}, ${content.address_city}`;
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
  return (
    <section id="location" className="section-pad bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="The neighborhood" title="Find Us" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm">
            <iframe
              title="Map to The Westside Airbnb"
              src={mapEmbed}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-display text-3xl font-semibold text-primary">{content.address_line1}</h3>
            <p className="mt-1 text-base text-muted-foreground">{content.address_city}</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {content.proximity_stats.map(({ time, label }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                  <div className="font-display text-2xl font-bold text-accent">{time}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8"
            >
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <MapPin className="mr-2 h-4 w-4" /> Get Directions
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BOOKING ---------------- */
function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function BookingSection({ initialRoom }: { initialRoom: string }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    roomId: initialRoom,
    checkIn: "",
    checkOut: "",
    guests: 2,
    requests: "",
  });
  useEffect(() => setForm((f) => ({ ...f, roomId: initialRoom })), [initialRoom]);

  const { rooms } = useSiteData();
  const room = rooms.find((r) => r.id === form.roomId) ?? rooms[0];

  const [bookedRanges, setBookedRanges] = useState<{ from: Date; to: Date }[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchAvailability(form.roomId)
      .then((ranges) => {
        if (!cancelled) {
          setBookedRanges(ranges.map((r) => ({ from: new Date(r.checkIn), to: new Date(r.checkOut) })));
        }
      })
      .catch(() => {
        // Availability display is best-effort; server still enforces no double-booking.
      });
    return () => {
      cancelled = true;
    };
  }, [form.roomId]);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const a = new Date(form.checkIn);
    const b = new Date(form.checkOut);
    const diff = Math.round((b.getTime() - a.getTime()) / 86400000);
    return diff > 0 ? diff : 0;
  }, [form.checkIn, form.checkOut]);

  const subtotal = nights * room.price;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Please enter your full name.");
    if (!form.phone.trim()) return toast.error("Please enter a phone number.");
    if (!form.checkIn || !form.checkOut) return toast.error("Please pick check-in and check-out dates.");
    if (nights <= 0) return toast.error("Check-out must be after check-in.");
    if (form.guests < 1 || form.guests > 6) return toast.error("Guests must be between 1 and 6.");

    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);
    const hasConflict = bookedRanges.some((r) => rangesOverlap(checkInDate, checkOutDate, r.from, r.to));
    if (hasConflict) return toast.error("Those dates are already booked for this room. Please choose different dates.");

    setSubmitting(true);
    try {
      await createBooking(form);
      toast.success("🎉 Booking request sent!", {
        description: "We'll confirm within 24 hours.",
      });
      setForm((f) => ({ ...f, checkIn: "", checkOut: "", requests: "" }));
      const ranges = await fetchAvailability(form.roomId).catch(() => null);
      if (ranges) setBookedRanges(ranges.map((r) => ({ from: new Date(r.checkIn), to: new Date(r.checkOut) })));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit booking request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Reserve your dates"
          title="Book Your Stay"
          kicker="Send a request and we'll get back to you within 24 hours."
        />
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+256 769 042 430"
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Room</Label>
                <Select value={form.roomId} onValueChange={(v) => setForm({ ...form, roomId: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} — ${r.price}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="checkin">Check-in</Label>
                <Input
                  id="checkin"
                  type="date"
                  required
                  value={form.checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="checkout">Check-out</Label>
                <Input
                  id="checkout"
                  type="date"
                  required
                  value={form.checkOut}
                  min={form.checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="guests">Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={6}
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="req">Special requests</Label>
                <Textarea
                  id="req"
                  value={form.requests}
                  onChange={(e) => setForm({ ...form, requests: e.target.value })}
                  placeholder="Late check-in or other special requests..."
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Sending..." : "Request to Book"}
            </Button>
          </form>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-primary">Price summary</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-foreground/80">
                  <span>
                    ${room.price} × {nights || 0} {nights === 1 ? "night" : "nights"}
                  </span>
                  <span>${subtotal}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-semibold text-primary">Total</span>
                <span className="font-display text-2xl font-bold text-accent">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <h3 className="px-2 pb-2 font-display text-lg font-semibold text-primary">Availability</h3>
              <Calendar
                mode="single"
                disabled={[{ before: new Date() }, ...bookedRanges]}
                className="pointer-events-auto mx-auto"
              />
              <p className="mt-2 px-2 text-xs text-muted-foreground">
                Greyed out dates are unavailable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- REVIEWS ---------------- */
function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i <= rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/40"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const initials = r.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
          {initials}
        </div>
        <div>
          <div className="font-medium text-foreground">
            {r.name} <span className="ml-1">{r.flag}</span>
          </div>
          <div className="text-xs text-muted-foreground">{r.date}</div>
        </div>
      </div>
      <div className="mt-3"><StarRow rating={r.rating} /></div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{r.text}</p>
    </article>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews()
      .then((fetched) => {
        if (fetched.length > 0) setReviews(fetched);
      })
      .catch(() => {
        // Keep the sample reviews shown if the backend is unreachable.
      });
  }, []);

  const average = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name.");
    if (rating < 1) return toast.error("Please select a star rating.");
    if (text.trim().length < 8) return toast.error("Please write at least a few words.");

    setSubmitting(true);
    try {
      const newReview = await createReview({ name: name.trim(), rating, text: text.trim() });
      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setRating(0);
      setText("");
      toast.success("Thanks for your review!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="section-pad bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Guest stories" title="What Our Guests Say" />
        <div className="mb-10 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 fill-[var(--gold)] text-[var(--gold)]" />
            <span className="font-display text-3xl font-bold text-primary">{average}</span>
            <span className="text-muted-foreground">· {reviews.length} reviews</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </div>

        <form
          onSubmit={submit}
          className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <h3 className="font-display text-2xl font-semibold text-primary">Leave a Review</h3>
          <div className="mt-4 grid gap-4">
            <div>
              <Label htmlFor="rname">Your name</Label>
              <Input
                id="rname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5"
                placeholder="Alex Smith"
              />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`Rate ${i} stars`}
                    className="rounded p-1"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${i <= (hover || rating)
                        ? "fill-[var(--gold)] text-[var(--gold)]"
                        : "text-muted-foreground/40"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="rtext">Your review</Label>
              <Textarea
                id="rtext"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-1.5 min-h-[110px]"
                placeholder="Share what made your stay special..."
              />
            </div>
            <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-.9-.86-1.44-2.03-1.44-3.32h-3.11v13.9c0 1.61-1.31 2.92-2.92 2.92a2.92 2.92 0 1 1 0-5.84c.29 0 .57.04.84.12v-3.16a6.07 6.07 0 0 0-.84-.06 6.06 6.06 0 1 0 6.06 6.06V9.38a8.9 8.9 0 0 0 4.65 1.31V7.58a5.4 5.4 0 0 1-3.24-1.76z" />
    </svg>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  const { content } = useSiteData();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <div className="font-display text-2xl font-bold">The Westside Airbnb</div>
          <p className="mt-3 text-sm text-primary-foreground/75">{content.hero_slogan}</p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">Quick links</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
            {[
              ["#rooms", "Rooms"],
              ["#amenities", "Amenities"],
              ["#booking", "Book Now"],
              ["#reviews", "Reviews"],
            ].map(([h, l]) => (
              <li key={h}>
                <a href={h} className="hover:text-accent">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
            <li>{content.contact_email}</li>
            <li>{content.contact_phone}</li>
            <li>
              {content.address_line1}, {content.address_city}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">Follow us</h4>
          <div className="mt-3 flex gap-3">
            <a
              href={content.instagram_url}
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-accent-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={content.tiktok_url}
              aria-label="TikTok"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-accent-foreground"
            >
              <TiktokIcon className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${content.whatsapp_number}`}
              aria-label="WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-accent-foreground"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-primary-foreground/70 sm:px-6 lg:px-8">
          © 2025 The Westside Airbnb. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ---------------- FLOATING BUTTONS ---------------- */
function FloatingButtons() {
  const { content } = useSiteData();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a
        href={`https://wa.me/${content.whatsapp_number}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-24 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}

/* ---------------- PAGE ---------------- */
export default function WestsidePage() {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOMS[0].id);
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    fetchRooms()
      .then((fetched) => {
        if (fetched.length > 0) setRooms(fetched);
      })
      .catch(() => {
        // Keep the static defaults shown if the backend is unreachable.
      });
    fetchContent()
      .then((fetched) => setContent((prev) => ({ ...prev, ...fetched })))
      .catch(() => {
        // Keep the static defaults shown if the backend is unreachable.
      });
  }, []);

  return (
    <SiteDataContext.Provider value={{ rooms, content }}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <RoomsSection onViewRoom={setActiveRoom} />
          <AmenitiesSection />
          <WhatWeOfferSection />
          <LocationSection />
          <BookingSection initialRoom={selectedRoomId} />
          <ReviewsSection />
        </main>
        <Footer />
        <FloatingButtons />
        <RoomModal
          room={activeRoom}
          onClose={() => setActiveRoom(null)}
          onBook={(id) => {
            setSelectedRoomId(id);
            setTimeout(() => {
              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
        />
      </div>
    </SiteDataContext.Provider>
  );
}
