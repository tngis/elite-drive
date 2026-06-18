import { ShieldCheck, Star, Car } from "lucide-react";
import { SearchBar } from "./search-bar";

export function Hero() {
  return (
    <section className="relative isolate mt-[-76px] flex min-h-[680px] flex-col justify-end overflow-hidden border-b border-border sm:min-h-[740px] lg:min-h-[800px]">
      {/* Cover зураг */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-cover.jpg"
        alt="Машин"
        className="absolute inset-0 -z-20 h-full w-full animate-in fade-in object-cover duration-1000"
      />

      {/* Cinematic overlay — доош харанхуйлж текст уншигдахуйц болгоно */}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/45 to-black/25" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_120%,transparent_40%,rgba(0,0,0,0.55))]" />

      <div className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <SearchBar />

          {/* Search-ийн ДООД талд — итгэлийн заагч (минимал) */}
          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-white/80">
            <Stat icon={<Car className="size-4 text-brand" />} text="1,200+ машин" />
            <span className="hidden h-3.5 w-px bg-white/20 sm:block" />
            <Stat
              icon={<Star className="size-4 fill-brand text-brand" />}
              text="4.8 дундаж үнэлгээ"
            />
            <span className="hidden h-3.5 w-px bg-white/20 sm:block" />
            <Stat
              icon={<ShieldCheck className="size-4 text-brand" />}
              text="Баталгаажсан эзэд"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2 font-medium">
      {icon}
      {text}
    </span>
  );
}
