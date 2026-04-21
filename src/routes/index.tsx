import { createFileRoute } from "@tanstack/react-router";

import { Calculator } from "@/components/calculator/Calculator";
import { SplashScreen } from "@/components/SplashScreen";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-dvh">
      <SplashScreen />
      <Calculator />
    </main>
  );
}
