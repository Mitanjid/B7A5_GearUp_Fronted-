import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GearItem } from "../_action/gear.action";

export function GearCard({ gear }: { gear: GearItem }) {
  return (
    <Link href={`/gear/${gear.id}`}>
      <Card className="flex h-full flex-col overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-video w-full shrink-0 bg-muted">
          {gear.imageUrl ? (
            <Image
              src={gear.imageUrl}
              alt={gear.name}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {!gear.isAvailable && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Unavailable
            </Badge>
          )}
        </div>

        <CardContent className="flex-1 space-y-2 pb-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{gear.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              {gear.category.name}
            </Badge>
          </div>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {gear.brand || "\u00A0"}
          </p>
        </CardContent>

        <CardFooter className="pb-4">
          <p className="text-lg font-bold">
            ${gear.pricePerDay}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
