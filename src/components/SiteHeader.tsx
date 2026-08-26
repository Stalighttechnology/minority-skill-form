import vtuLogo from "@/assets/vtu-logo.png.asset.json";
import karnatakaEmblem from "@/assets/karnataka-emblem.png.asset.json";
import campusBg from "@/assets/campus-bg.jpg.asset.json";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="w-full border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <img
            src={vtuLogo.url}
            alt="Visvesvaraya Technological University logo"
            className="h-12 w-auto max-w-[62%] object-contain object-left sm:h-14"
          />
          <img
            src={karnatakaEmblem.url}
            alt="Government of Karnataka emblem"
            className="h-12 w-auto shrink-0 object-contain sm:h-14"
          />
        </div>
      </div>

      <div className="relative isolate overflow-hidden">
        <img
          src={campusBg.url}
          alt="VTU Belagavi campus"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-deep/70" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 text-center text-navy-foreground sm:py-16">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
            Visvesvaraya Technological University, Belagavi
          </h1>
          <p className="mt-2 text-sm text-navy-foreground/80">
            (State Technological University, Govt. of Karnataka)
          </p>
          <p className="mt-4 text-lg font-medium sm:text-xl">
            Skill Development @ VTU — Application Form
          </p>
        </div>
      </div>
    </header>
  );
}
