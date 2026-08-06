import { Search, CalendarCheck, Backpack } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find your gear",
    description:
      "Filter by category, dates, and location to see what's actually available near you.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Book your dates",
    description:
      "Pick your rental window and pay securely — no back-and-forth messaging required.",
  },
  {
    number: "03",
    icon: Backpack,
    title: "Pick up & go",
    description:
      "Meet the provider, grab your gear, and get back to what you actually came here for.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 text-2xl font-bold tracking-tight">
          Renting gear shouldn&apos;t be complicated
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">
                  {step.number}
                </span>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-4" />
                </div>
              </div>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
