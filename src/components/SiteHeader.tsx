import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

const NAV = [
  "Home",
  "About VTU",
  "Academics",
  "Facilities",
  "Examination",
  "VTU Programmes",
  "Skill Development",
  "Affiliated Colleges",
  "Online Services",
  "Global Campus",
];

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="hidden bg-background py-2 lg:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4">
          <span className="topbar-pill bg-[oklch(0.78_0.15_65)]">English</span>
          <span className="text-sm text-muted-foreground">ಕನ್ನಡ</span>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <span className="topbar-pill">Online Fee Payment</span>
            <span className="topbar-pill">Online Degree</span>
            <span className="topbar-pill">EDDTS</span>
            <span className="topbar-pill">NIRF</span>
            <div className="flex items-center gap-2 border-b border-input pb-1">
              <input
                aria-label="Search the site"
                placeholder="What are you looking for?"
                className="w-44 bg-transparent text-sm italic outline-none"
              />
              <Search className="size-4 text-muted-foreground" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy-deep text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
          <div className="flex items-center gap-4">
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
            <Link
              to="/register"
              className="btn-lime ml-auto hidden text-xs sm:inline-flex"
            >
              Apply for Training
            </Link>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 border-t border-navy-foreground/15 pt-3 text-[0.78rem] font-medium tracking-wide">
            {NAV.map((item) =>
              item === "Skill Development" ? (
                <Link key={item} to="/" className="text-lime">
                  {item}
                </Link>
              ) : (
                <span key={item} className="text-navy-foreground/80">
                  {item}
                </span>
              ),
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
