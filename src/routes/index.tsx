import { createFileRoute } from "@tanstack/react-router";

import { Calculator } from "@/components/calculator/Calculator";
import { SplashScreen } from "@/components/SplashScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "Windmar Home · Solar EV Calculator",
      },
      {
        name: "description",
        content:
          "Windmar Home Solar EV Calculator: paneles de 410 W necesarios para su vehículo eléctrico.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-dvh">
      <SplashScreen />
      <Calculator />
    </main>
  );
}
