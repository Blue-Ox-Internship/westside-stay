import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllBookings, updateBookingStatus, type Booking } from "@/lib/api";
import { ROOMS } from "@/components/site/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — The Westside Airbnb" }],
  }),
  component: AdminPage,
});

const STORAGE_KEY = "westside_admin_password";

function statusVariant(status: Booking["status"]): "default" | "secondary" | "destructive" {
  if (status === "confirmed") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
}

function roomName(roomId: string): string {
  return ROOMS.find((r) => r.id === roomId)?.name ?? roomId;
}

function AdminPage() {
  const [password, setPassword] = useState<string | null>(() => sessionStorage.getItem(STORAGE_KEY));
  const [passwordInput, setPasswordInput] = useState("");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadBookings = async (pwd: string) => {
    setLoading(true);
    try {
      const rows = await fetchAllBookings(pwd);
      setBookings(rows);
      sessionStorage.setItem(STORAGE_KEY, pwd);
      setPassword(pwd);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load bookings.");
      if (err instanceof Error && err.message === "Incorrect password.") {
        sessionStorage.removeItem(STORAGE_KEY);
        setPassword(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (password) loadBookings(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    loadBookings(passwordInput.trim());
  };

  const handleStatusChange = async (id: string, status: Booking["status"]) => {
    if (!password) return;
    setUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, status, password);
      setBookings((prev) => (prev ? prev.map((b) => (b.id === id ? updated : b)) : prev));
      toast.success(`Booking marked ${status}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!password || !bookings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <h1 className="font-display text-2xl font-semibold text-primary">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to manage bookings.</p>
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
          <Button type="submit" disabled={loading} className="mt-5 w-full">
            {loading ? "Checking..." : "Log In"}
          </Button>
        </form>
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-primary">Bookings</h1>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem(STORAGE_KEY);
              setPassword(null);
              setBookings(null);
              setPasswordInput("");
            }}
          >
            Log Out
          </Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.phone}</div>
                  </TableCell>
                  <TableCell>{roomName(b.room_id)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {b.check_in.slice(0, 10)} → {b.check_out.slice(0, 10)}
                  </TableCell>
                  <TableCell>{b.guests}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground">
                    {b.requests || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(b.status)} className="capitalize">
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {b.status !== "confirmed" && (
                      <Button
                        size="sm"
                        disabled={updatingId === b.id}
                        onClick={() => handleStatusChange(b.id, "confirmed")}
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
                        onClick={() => handleStatusChange(b.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
