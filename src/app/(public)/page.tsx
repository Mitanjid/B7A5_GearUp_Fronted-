import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Rent Sports & Outdoor Gear Instantly
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse quality equipment from trusted providers near you.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/gear">Browse Gear</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/register">Get Started</Link>}
          />
        </div>
      </div>
    </div>
  );
}
