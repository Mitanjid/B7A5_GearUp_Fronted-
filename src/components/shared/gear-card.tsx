import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export interface GearCardData {
  id: string;
  name: string;
  imageUrl?: string | null;
  pricePerDay: string;
  isAvailable: boolean;
  category: { name: string };
}

export function GearCard({ gear }: { gear: GearCardData }) {
  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {gear.imageUrl ? (
          <Image
            src={gear.imageUrl}
            alt={gear.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {!gear.isAvailable && (
          <Badge variant="destructive" className="absolute right-3 top-3">
            Unavailable
          </Badge>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs font-medium text-muted-foreground">
          {gear.category.name}
        </p>
        <h3 className="font-semibold leading-snug">{gear.name}</h3>
        <p className="text-sm">
          <span className="font-semibold">${gear.pricePerDay}</span>
          <span className="text-muted-foreground"> / day</span>
        </p>
      </div>
    </Link>
  );
}
