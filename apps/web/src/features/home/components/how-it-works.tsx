import { Search, CalendarCheck, KeyRound } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Машинаа олоорой",
    text: "Байршил, огноо, ангилалаар шүүж өөртөө таарсан машинаа сонгоно.",
  },
  {
    icon: CalendarCheck,
    title: "Захиалга илгээх",
    text: "Огноогоо сонгож эзэн рүү түрээсийн хүсэлт илгээнэ. Эзэн зөвшөөрнө.",
  },
  {
    icon: KeyRound,
    title: "Машинаа аваарай",
    text: "Тохирсон цагт машинаа хүлээж авч, аялалаа эхлүүлнэ. Энгийн, найдвартай.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border bg-muted/30"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Хэрхэн ажилладаг вэ?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Гурван энгийн алхамаар машинаа түрээслээрэй.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="absolute right-5 top-5 text-5xl font-bold text-muted/60">
                {i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-xl bg-brand/15 text-brand">
                <step.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
