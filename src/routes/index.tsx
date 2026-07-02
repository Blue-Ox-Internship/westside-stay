import { createFileRoute } from "@tanstack/react-router";
import WestsidePage from "@/components/site/WestsidePage";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Westside Airbnb — Where comfort meets home!" },
      {
        name: "description",
        content:
          "Book The Westside Airbnb in Mbarara — luxury rooms, mini-garden, and dedicated host support.",
      },
      { property: "og:title", content: "The Westside Airbnb" },
      {
        property: "og:description",
        content: "Where comfort meets home!",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <WestsidePage />
      <Toaster position="top-center" richColors />
    </>
  );
}
