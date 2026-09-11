import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/hero/Hero";
import { Problem } from "@/components/sections/problem/Problem";
import { System } from "@/components/sections/system/System";

export default function HomePage() {
  return (
    <main>
      <div className="relative">
        <Header />
        <Hero />
      </div>

      <Problem />
      <System />
    </main>
  );
}