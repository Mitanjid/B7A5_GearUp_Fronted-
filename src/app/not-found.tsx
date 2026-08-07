import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <Card className="w-full rounded-2xl text-center shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchX className="size-7" />
          </div>
          <h1 className="text-xl font-bold">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button
            className="w-full rounded-full"
            nativeButton={false}
            render={<Link href="/">Back to home</Link>}
          />
        </CardContent>
      </Card>
    </div>
  );
}
