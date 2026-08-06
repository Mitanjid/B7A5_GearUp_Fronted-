import { Dumbbell } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-primary to-primary/70 p-10 text-primary-foreground lg:flex">
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-2 text-xl font-bold">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/15">
            <Dumbbell className="size-5" />
          </div>
          GearUp
        </div>

        <div className="relative space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Rent Sports & Outdoor Gear Instantly
          </h2>
          <p className="text-primary-foreground/80">
            Join thousands of adventurers renting quality equipment from trusted
            local providers.
          </p>
        </div>

        <p className="relative text-sm text-primary-foreground/60">
          © 2026 GearUp. All rights reserved.
        </p>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
