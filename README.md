# 🏡 The Westside Stay

> A premium Airbnb listing website for **The Westside Airbnb** — a luxury short-stay property in Kampala, Uganda.

---

## ✨ Overview

**The Westside Stay** is a fully responsive, single-page marketing and booking website built for a boutique Airbnb property. It showcases the property's two distinct rooms, highlights its amenities, lets potential guests browse availability, submit booking requests, and leave reviews — all in one sleek, modern interface.

---

## 🗂️ Sections

| Section | Description |
|---|---|
| **Hero** | Full-screen banner with the property tagline and call-to-action buttons |
| **Rooms** | Card gallery for the Studio Room ($85/night) and One Bedroom ($120/night) with a detail modal |
| **Amenities** | Visual grid of 12 included amenities (WiFi, Pool, Kitchen, Parking, etc.) |
| **Why Choose Us** | Three value-proposition cards: Prime Location, Entire Place, Dedicated Host |
| **Location** | Embedded Google Map + proximity stats for Kampala, Uganda |
| **Book Your Stay** | Multi-field booking form with live price summary (room rate + cleaning fee + 10% service fee) and an availability calendar |
| **Reviews** | Guest review cards (with star ratings) + a form to submit a new review |
| **Footer** | Social links (Instagram, Facebook), quick nav links, copyright |

---

## 🛏️ Room Listings

### Studio Room — $85 / night
- Up to **2 guests** · 1 Queen Bed · 320 sq ft
- Amenities: Kitchenette, Ensuite bathroom, Smart TV, Air conditioning, Workspace

### One Bedroom — $120 / night
- Up to **3 guests** · 1 King Bed · 480 sq ft
- Amenities: Separate living room, Full kitchen, Ensuite bathroom, Smart TV, Air conditioning

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19, SSR-ready) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (file-based) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + custom design tokens |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Forms** | React Hook Form + Zod |
| **Date Picker** | react-day-picker |
| **Notifications** | Sonner (toast system) |
| **Build Tool** | [Vite 8](https://vitejs.dev) |
| **Type Safety** | TypeScript 5 |
| **Linting** | ESLint + Prettier |
| **Deployment** | [Lovable](https://lovable.dev) (Cloudflare via Nitro) |

### Design System
- **Fonts:** Playfair Display (headings) · Inter (body)
- **Palette:** Forest green `#1B4332` · Warm cream `#FDF6EC` · Gold `#C9A84C`
- **Dark mode** supported via `.dark` class

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or bun

### Install dependencies

```bash
npm install
# or
bun install
```

### Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000** (or the port shown in your terminal).

### Other scripts

| Command | Description |
|---|---|
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 📁 Project Structure

```
the-westside-stay/
├── src/
│   ├── components/
│   │   ├── site/
│   │   │   ├── WestsidePage.tsx   # All page sections (Navbar, Hero, Rooms, etc.)
│   │   │   └── data.ts            # Room listings & sample reviews data
│   │   └── ui/                    # shadcn/ui component library
│   ├── routes/
│   │   ├── __root.tsx             # Root layout (fonts, meta, global providers)
│   │   └── index.tsx              # "/" route — renders WestsidePage + Toaster
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility helpers (cn, etc.)
│   ├── server.ts                  # SSR error wrapper for Nitro
│   ├── start.ts                   # TanStack Start entry point
│   ├── router.tsx                 # Router creation
│   └── styles.css                 # Global CSS, design tokens, Tailwind config
├── vite.config.ts                 # Vite + Lovable config
├── components.json                # shadcn/ui component registry config
├── tsconfig.json
└── package.json
```

---

## 🌐 SEO

The index route includes full meta tags:
- **Title:** `The Westside Airbnb — Your home away from home`
- **Description:** Optimized for Kampala luxury short-stay searches
- **Open Graph:** Title, description, and hero image for rich social previews

---

## 📍 Property Location

> **123 Westside Avenue, Kampala, Uganda**
>
> - 10 min to City Centre
> - 5 min to Supermarket
> - 15 min to Airport

---

## 🤝 Contributing

This project is connected to [Lovable](https://lovable.dev). Please **do not** force-push, rebase, amend, or squash commits that have already been pushed — doing so rewrites history on Lovable's side and may result in lost project history.

---

## 📄 License

Private — all rights reserved by the property owner.
