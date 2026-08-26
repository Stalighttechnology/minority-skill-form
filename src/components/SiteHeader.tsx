import vtuLogo from "@/assets/Visvesvaraya_Technological_University_logo.png";
import karnatakaEmblem from "@/assets/Karnataka-rightlogo.png";
import campusBg from "@/assets/about-bg1-1.jpg";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="w-full border-b border-gray-200 bg-white shadow-xs">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center justify-between w-full md:w-auto">
            <img
              src={vtuLogo}
              alt="Visvesvaraya Technological University logo"
              className="h-12 sm:h-16 w-auto object-contain object-left"
            />
            {/* Karnataka Emblem on mobile (hidden on desktop) */}
            <img
              src={karnatakaEmblem}
              alt="Government of Karnataka emblem"
              className="h-12 sm:h-16 w-auto shrink-0 object-contain md:hidden"
            />
          </div>
          
          <div className="flex flex-col items-center text-center flex-1 px-2 py-1">
            <h2 className="text-slate-900 font-bold text-xs sm:text-sm md:text-[18px] leading-tight">
              ವಿಶ್ವೇಶ್ವರಯ್ಯ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಬೆಳಗಾವಿ <span className="font-normal text-[10px] sm:text-[11px] md:text-[13px] text-slate-600 block sm:inline mt-0.5 sm:mt-0">(ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ)</span>
            </h2>
            <h3 className="text-slate-900 font-bold text-[10px] sm:text-xs md:text-[15px] mt-1 leading-tight">
              Visvesvaraya Technological University, Belagavi <span className="font-normal text-[9px] sm:text-[10px] md:text-[12px] text-slate-500 block sm:inline mt-0.5 sm:mt-0">(State Technological University, Govt. of Karnataka)</span>
            </h3>
          </div>

          {/* Karnataka Emblem on desktop (hidden on mobile) */}
          <img
            src={karnatakaEmblem}
            alt="Government of Karnataka emblem"
            className="h-16 w-auto shrink-0 object-contain hidden md:block"
          />
        </div>
      </div>

      <div className="relative isolate overflow-hidden">
        <img
          src={campusBg}
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
