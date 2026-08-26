export function SiteHeader() {
  return (
    <header className="w-full bg-navy-deep text-navy-foreground">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy-foreground/95 text-xs font-bold text-navy">
          VTU
        </div>
        <div className="leading-tight">
          <p className="font-display text-lg font-bold sm:text-xl">
            Visvesvaraya Technological University, Belagavi
          </p>
          <p className="text-xs text-navy-foreground/70">
            (State Technological University, Govt. of Karnataka)
          </p>
        </div>
      </div>
    </header>
  );
}
