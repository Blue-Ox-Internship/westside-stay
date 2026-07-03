import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchAllBookings,
  updateBookingStatus,
  fetchRooms,
  updateRoom,
  fetchContent,
  updateContent,
  uploadToCloudinary,
  optimizedVideoUrl,
  type Booking,
  type SiteContent,
} from "@/lib/api";
import { ROOMS, type Room } from "@/components/site/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — The Westside Airbnb" }],
  }),
  component: AdminPage,
});

const STORAGE_KEY = "westside_admin_password";

const DEFAULT_SITE_CONTENT: SiteContent = {
  hero_slogan: "",
  contact_email: "",
  contact_phone: "",
  whatsapp_number: "",
  instagram_url: "",
  tiktok_url: "",
  airbnb_url: "",
  address_line1: "",
  address_city: "",
  proximity_stats: [
    { time: "", label: "" },
    { time: "", label: "" },
    { time: "", label: "" },
  ],
  why_choose_us: [
    { title: "", desc: "" },
    { title: "", desc: "" },
    { title: "", desc: "" },
  ],
  exterior: { description: "", images: [], videos: [] },
  payment_methods: [],
};

function statusVariant(status: Booking["status"]): "default" | "secondary" | "destructive" {
  if (status === "confirmed") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
}

function roomName(roomId: string): string {
  return ROOMS.find((r) => r.id === roomId)?.name ?? roomId;
}

const TABS = ["Bookings", "Rooms", "Content"] as const;
type Tab = (typeof TABS)[number];

function AdminPage() {
  const [password, setPassword] = useState<string | null>(() => sessionStorage.getItem(STORAGE_KEY));
  const [passwordInput, setPasswordInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [tab, setTab] = useState<Tab>("Bookings");

  const verifyPassword = async (pwd: string) => {
    setVerifying(true);
    try {
      await fetchAllBookings(pwd);
      sessionStorage.setItem(STORAGE_KEY, pwd);
      setPassword(pwd);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to log in.");
      if (err instanceof Error && err.message === "Incorrect password.") {
        sessionStorage.removeItem(STORAGE_KEY);
        setPassword(null);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    verifyPassword(passwordInput.trim());
  };

  if (!password) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <h1 className="font-display text-2xl font-semibold text-primary">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to manage the site.</p>
          <div className="mt-5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" disabled={verifying} className="mt-5 w-full">
            {verifying ? "Checking..." : "Log In"}
          </Button>
        </form>
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem(STORAGE_KEY);
              setPassword(null);
              setPasswordInput("");
            }}
          >
            Log Out
          </Button>
        </div>

        <div className="mt-6">
          {tab === "Bookings" && <BookingsTab password={password} />}
          {tab === "Rooms" && <RoomsTab password={password} />}
          {tab === "Content" && <ContentTab password={password} />}
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(aEnd) > new Date(bStart);
}

function whatsAppConfirmationLink(booking: Booking, roomLabel: string): string {
  const phoneDigits = booking.phone.replace(/[^\d]/g, "");
  const message =
    `Hi ${booking.name}! Your booking for ${roomLabel} is confirmed 🎉\n\n` +
    `📍 Room: ${booking.unit_label}\n` +
    `📅 Check-in: ${booking.check_in.slice(0, 10)}\n` +
    `📅 Check-out: ${booking.check_out.slice(0, 10)}\n\n` +
    `Your room is ready for you. See you soon!`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

function BookingsTab({ password }: { password: string }) {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAllBookings(password)
      .then(setBookings)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load bookings."));
    fetchRooms()
      .then(setRooms)
      .catch(() => setRooms(ROOMS));
  }, [password]);

  const availableUnitsFor = (booking: Booking): string[] => {
    const room = rooms?.find((r) => r.id === booking.room_id);
    if (!room) return [];
    const taken = new Set(
      (bookings ?? [])
        .filter(
          (other) =>
            other.id !== booking.id &&
            other.room_id === booking.room_id &&
            other.status === "confirmed" &&
            other.unit_label &&
            datesOverlap(booking.check_in, booking.check_out, other.check_in, other.check_out)
        )
        .map((other) => other.unit_label as string)
    );
    return room.units.filter((u) => !taken.has(u));
  };

  const handleConfirm = async (booking: Booking) => {
    const unitLabel = selectedUnit[booking.id] ?? availableUnitsFor(booking)[0];
    if (!unitLabel) return toast.error("No room numbers available for those dates.");
    setUpdatingId(booking.id);
    try {
      const updated = await updateBookingStatus(booking.id, "confirmed", password, unitLabel);
      setBookings((prev) => (prev ? prev.map((b) => (b.id === booking.id ? updated : b)) : prev));
      toast.success(`Booking confirmed — assigned ${unitLabel}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, "cancelled", password);
      setBookings((prev) => (prev ? prev.map((b) => (b.id === id ? updated : b)) : prev));
      toast.success("Booking cancelled.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!bookings) return <p className="text-muted-foreground">Loading bookings...</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Requests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No bookings yet.
              </TableCell>
            </TableRow>
          )}
          {bookings.map((b) => {
            const options = availableUnitsFor(b);
            return (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.phone}</div>
                  {b.email && <div className="text-xs text-muted-foreground">{b.email}</div>}
                </TableCell>
                <TableCell>
                  {roomName(b.room_id)}
                  {b.unit_label && <div className="text-xs text-muted-foreground">Room: {b.unit_label}</div>}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {b.check_in.slice(0, 10)} → {b.check_out.slice(0, 10)}
                </TableCell>
                <TableCell>{b.guests}</TableCell>
                <TableCell className="max-w-[220px] truncate text-muted-foreground">{b.requests || "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(b.status)} className="capitalize">
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {b.status !== "confirmed" && (
                    <div className="mb-2 flex items-center justify-end gap-2">
                      {options.length > 0 ? (
                        <select
                          value={selectedUnit[b.id] ?? options[0]}
                          onChange={(e) => setSelectedUnit((s) => ({ ...s, [b.id]: e.target.value }))}
                          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                        >
                          {options.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-destructive">No rooms free for these dates</span>
                      )}
                    </div>
                  )}
                  {b.status === "confirmed" && (
                    <a
                      href={whatsAppConfirmationLink(b, roomName(b.room_id))}
                      target="_blank"
                      rel="noreferrer"
                      className="mb-2 inline-block"
                    >
                      <Button size="sm" variant="outline" className="mr-2">
                        Message Guest
                      </Button>
                    </a>
                  )}
                  {b.status !== "confirmed" && (
                    <Button
                      size="sm"
                      disabled={updatingId === b.id || options.length === 0}
                      onClick={() => handleConfirm(b)}
                      className="mr-2"
                    >
                      Confirm
                    </Button>
                  )}
                  {b.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === b.id}
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function RoomsTab({ password }: { password: string }) {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [newUnitDrafts, setNewUnitDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load rooms."));
  }, []);

  const updateField = (id: string, patch: Partial<Room>) => {
    setRooms((prev) => (prev ? prev.map((r) => (r.id === id ? { ...r, ...patch } : r)) : prev));
  };

  const addUnit = (room: Room) => {
    const draft = (newUnitDrafts[room.id] ?? "").trim();
    if (!draft) return;
    updateField(room.id, { units: [...room.units, draft] });
    setNewUnitDrafts((d) => ({ ...d, [room.id]: "" }));
  };

  const handleSave = async (room: Room) => {
    setSavingId(room.id);
    try {
      const updated = await updateRoom(room.id, room, password);
      setRooms((prev) => (prev ? prev.map((r) => (r.id === room.id ? updated : r)) : prev));
      toast.success(`${room.name} saved.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save room.");
    } finally {
      setSavingId(null);
    }
  };

  const handleImageUpload = async (room: Room, file: File) => {
    setUploadingId(room.id);
    try {
      const url = await uploadToCloudinary(file, password, "image");
      updateField(room.id, { images: [...room.images, url] });
      toast.success("Image uploaded — click Save to publish.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleVideoUpload = async (room: Room, file: File) => {
    setUploadingId(room.id);
    try {
      const url = await uploadToCloudinary(file, password, "video");
      updateField(room.id, { videos: [...room.videos, url] });
      toast.success("Video uploaded — click Save to publish.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  if (!rooms) return <p className="text-muted-foreground">Loading rooms...</p>;

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <div key={room.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-display text-xl font-semibold text-primary">{room.name}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input
                value={room.name}
                onChange={(e) => updateField(room.id, { name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Price / night ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={room.price}
                onChange={(e) => updateField(room.id, { price: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Max guests</Label>
              <Input
                type="number"
                value={room.maxGuests}
                onChange={(e) => updateField(room.id, { maxGuests: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Bed</Label>
              <Input
                value={room.bed}
                onChange={(e) => updateField(room.id, { bed: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Size (sq ft)</Label>
              <Input
                type="number"
                value={room.size}
                onChange={(e) => updateField(room.id, { size: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Room numbers</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                One entry per physical room (e.g. "Studio 12"). A date is only shown as unavailable once every
                room number below is booked. When you confirm a booking you'll assign one of these.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {room.units.map((unit, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 py-1 pl-3 pr-1.5 text-sm"
                  >
                    {unit}
                    <button
                      type="button"
                      onClick={() => updateField(room.id, { units: room.units.filter((_, idx) => idx !== i) })}
                      aria-label={`Remove ${unit}`}
                      className="grid h-4 w-4 place-items-center rounded-full text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder='e.g. "Studio 4"'
                  value={newUnitDrafts[room.id] ?? ""}
                  onChange={(e) => setNewUnitDrafts((d) => ({ ...d, [room.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addUnit(room);
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => addUnit(room)}>
                  Add
                </Button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Short description</Label>
              <Textarea
                value={room.description}
                onChange={(e) => updateField(room.id, { description: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Full description</Label>
              <Textarea
                value={room.longDescription}
                onChange={(e) => updateField(room.id, { longDescription: e.target.value })}
                className="mt-1.5 min-h-[100px]"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Amenities (comma separated)</Label>
              <Input
                value={room.amenities.join(", ")}
                onChange={(e) =>
                  updateField(room.id, {
                    amenities: e.target.value
                      .split(",")
                      .map((a) => a.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="mt-5">
            <Label>Photos</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {room.images.map((url, i) => (
                <div key={url} className="relative">
                  <img src={url} className="h-20 w-28 rounded-lg object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() =>
                      updateField(room.id, { images: room.images.filter((_, idx) => idx !== i) })
                    }
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground hover:bg-secondary/50">
                {uploadingId === room.id ? "Uploading..." : "+ Add photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(room, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <div className="mt-5">
            <Label>Videos</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {room.videos.map((url, i) => (
                <div key={url} className="relative">
                  <video src={optimizedVideoUrl(url)} className="h-20 w-28 rounded-lg object-cover" muted />
                  <button
                    type="button"
                    onClick={() =>
                      updateField(room.id, { videos: room.videos.filter((_, idx) => idx !== i) })
                    }
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground hover:bg-secondary/50">
                {uploadingId === room.id ? "Uploading..." : "+ Add video"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleVideoUpload(room, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <Button onClick={() => handleSave(room)} disabled={savingId === room.id} className="mt-5">
            {savingId === room.id ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ))}
    </div>
  );
}

function ContentTab({ password }: { password: string }) {
  const [content, setContentState] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingExterior, setUploadingExterior] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    fetchContent()
      .then((c) => setContentState({ ...DEFAULT_SITE_CONTENT, ...c }))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load content."));
  }, []);

  const update = (patch: Partial<SiteContent>) =>
    setContentState((prev) => (prev ? { ...prev, ...patch } : prev));

  const updateCard = (i: number, patch: Partial<{ title: string; desc: string }>) => {
    setContentState((prev) => {
      if (!prev) return prev;
      const cards = [...prev.why_choose_us];
      cards[i] = { ...cards[i], ...patch };
      return { ...prev, why_choose_us: cards };
    });
  };

  const updateStat = (i: number, patch: Partial<{ time: string; label: string }>) => {
    setContentState((prev) => {
      if (!prev) return prev;
      const stats = [...prev.proximity_stats];
      stats[i] = { ...stats[i], ...patch };
      return { ...prev, proximity_stats: stats };
    });
  };

  const updateExterior = (patch: Partial<SiteContent["exterior"]>) => {
    setContentState((prev) => (prev ? { ...prev, exterior: { ...prev.exterior, ...patch } } : prev));
  };

  const addPaymentMethod = () => {
    setContentState((prev) =>
      prev ? { ...prev, payment_methods: [...prev.payment_methods, { name: "", details: "" }] } : prev
    );
  };

  const updatePaymentMethod = (i: number, patch: Partial<{ name: string; details: string }>) => {
    setContentState((prev) => {
      if (!prev) return prev;
      const methods = [...prev.payment_methods];
      methods[i] = { ...methods[i], ...patch };
      return { ...prev, payment_methods: methods };
    });
  };

  const removePaymentMethod = (i: number) => {
    setContentState((prev) =>
      prev ? { ...prev, payment_methods: prev.payment_methods.filter((_, idx) => idx !== i) } : prev
    );
  };

  const handleExteriorImageUpload = async (file: File) => {
    setUploadingExterior("image");
    try {
      const url = await uploadToCloudinary(file, password, "image", "exterior");
      setContentState((prev) =>
        prev ? { ...prev, exterior: { ...prev.exterior, images: [...prev.exterior.images, url] } } : prev
      );
      toast.success("Image uploaded — click Save to publish.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingExterior(null);
    }
  };

  const handleExteriorVideoUpload = async (file: File) => {
    setUploadingExterior("video");
    try {
      const url = await uploadToCloudinary(file, password, "video", "exterior");
      setContentState((prev) =>
        prev ? { ...prev, exterior: { ...prev.exterior, videos: [...prev.exterior.videos, url] } } : prev
      );
      toast.success("Video uploaded — click Save to publish.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingExterior(null);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await updateContent(content, password);
      toast.success("Site content saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  if (!content) return <p className="text-muted-foreground">Loading content...</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-primary">Hero &amp; Contact</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Hero slogan</Label>
            <Input
              value={content.hero_slogan}
              onChange={(e) => update({ hero_slogan: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Contact email</Label>
            <Input
              value={content.contact_email}
              onChange={(e) => update({ contact_email: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Contact phone</Label>
            <Input
              value={content.contact_phone}
              onChange={(e) => update({ contact_phone: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>WhatsApp number (digits + country code)</Label>
            <Input
              value={content.whatsapp_number}
              onChange={(e) => update({ whatsapp_number: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Instagram URL</Label>
            <Input
              value={content.instagram_url}
              onChange={(e) => update({ instagram_url: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>TikTok URL</Label>
            <Input
              value={content.tiktok_url}
              onChange={(e) => update({ tiktok_url: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Airbnb listing URL</Label>
            <Input
              value={content.airbnb_url}
              onChange={(e) => update({ airbnb_url: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Address line</Label>
            <Input
              value={content.address_line1}
              onChange={(e) => update({ address_line1: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>City / country</Label>
            <Input
              value={content.address_city}
              onChange={(e) => update({ address_city: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-primary">Exterior</h2>
        <div className="mt-4">
          <Label>Description</Label>
          <Textarea
            value={content.exterior.description}
            onChange={(e) => updateExterior({ description: e.target.value })}
            className="mt-1.5 min-h-[100px]"
          />
        </div>

        <div className="mt-5">
          <Label>Photos</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {content.exterior.images.map((url, i) => (
              <div key={url} className="relative">
                <img src={url} className="h-20 w-28 rounded-lg object-cover" alt="" />
                <button
                  type="button"
                  onClick={() =>
                    updateExterior({ images: content.exterior.images.filter((_, idx) => idx !== i) })
                  }
                  className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground hover:bg-secondary/50">
              {uploadingExterior === "image" ? "Uploading..." : "+ Add photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleExteriorImageUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <div className="mt-5">
          <Label>Videos</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {content.exterior.videos.map((url, i) => (
              <div key={url} className="relative">
                <video src={optimizedVideoUrl(url)} className="h-20 w-28 rounded-lg object-cover" muted />
                <button
                  type="button"
                  onClick={() =>
                    updateExterior({ videos: content.exterior.videos.filter((_, idx) => idx !== i) })
                  }
                  className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground hover:bg-secondary/50">
              {uploadingExterior === "video" ? "Uploading..." : "+ Add video"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleExteriorVideoUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-primary">Payment methods</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shown to guests via a "Payment Methods" button when they book.
        </p>
        <div className="mt-4 space-y-4">
          {content.payment_methods.map((m, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto] sm:items-start">
              <Input
                value={m.name}
                onChange={(e) => updatePaymentMethod(i, { name: e.target.value })}
                placeholder="e.g. MTN Mobile Money"
              />
              <Textarea
                value={m.details}
                onChange={(e) => updatePaymentMethod(i, { details: e.target.value })}
                placeholder="Payment details / instructions"
                className="min-h-[70px]"
              />
              <button
                type="button"
                onClick={() => removePaymentMethod(i)}
                aria-label="Remove payment method"
                className="grid h-9 w-9 place-items-center rounded-full bg-destructive text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPaymentMethod}>
            + Add payment method
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-primary">Proximity stats</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {content.proximity_stats.map((s, i) => (
            <div key={i} className="space-y-2">
              <Input value={s.time} onChange={(e) => updateStat(i, { time: e.target.value })} placeholder="10 min" />
              <Input
                value={s.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
                placeholder="to City Centre"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-primary">Why Choose Us cards</h2>
        <div className="mt-4 space-y-4">
          {content.why_choose_us.map((c, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr]">
              <Input value={c.title} onChange={(e) => updateCard(i, { title: e.target.value })} placeholder="Title" />
              <Textarea
                value={c.desc}
                onChange={(e) => updateCard(i, { desc: e.target.value })}
                placeholder="Description"
                className="min-h-[70px]"
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Content"}
      </Button>
    </div>
  );
}
