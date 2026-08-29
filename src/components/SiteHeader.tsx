import vtuLogo from "@/assets/Visvesvaraya_Technological_University_logo.png";
import karnatakaEmblem from "@/assets/Karnataka-rightlogo.png";
import cmKarnatakaImg from "@/assets/CM karnataka.jpg";
import utKhaderImg from "@/assets/ut khader.jpg";
import campusBg from "@/assets/about-bg1-1.jpg";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="w-full border-b border-gray-200 bg-white shadow-xs">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3.5 max-w-[1400px]">
          {/* Top row on mobile: Logos on left and Dignitaries on right */}
          <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-4 shrink-0">
            {/* Left side: VTU Logo and Karnataka Emblem */}
            <div className="flex items-center gap-2 sm:gap-4">
              <img
                src={vtuLogo}
                alt="Visvesvaraya Technological University logo"
                className="h-11 sm:h-14 md:h-16 w-auto object-contain"
              />
              <img
                src={karnatakaEmblem}
                alt="Government of Karnataka emblem"
                className="h-11 sm:h-14 md:h-16 w-auto object-contain"
              />
            </div>

            {/* Right side for mobile (rendered inline on mobile) */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden border-2 border-[#166534] bg-white shadow-xs">
                  <img
                    src={cmKarnatakaImg}
                    alt="Shri D. K. Shivakumar"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <span className="mt-0.5 font-sans text-[8.5px] sm:text-[9.5px] font-bold text-[#1e293b] leading-tight whitespace-nowrap block">
                  Shri D. K. Shivakumar
                </span>
                <span className="font-sans text-[7.5px] sm:text-[8px] font-semibold text-[#0f766e] leading-none whitespace-nowrap block">
                  Hon'ble CM
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden border-2 border-[#166534] bg-white shadow-xs">
                  <img
                    src={utKhaderImg}
                    alt="Shri U. T. Khader"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <span className="mt-0.5 font-sans text-[8.5px] sm:text-[9.5px] font-bold text-[#1e293b] leading-tight whitespace-nowrap block">
                  Shri U. T. Khader
                </span>
                <span className="font-sans text-[7.5px] sm:text-[8px] font-semibold text-[#0f766e] leading-none whitespace-nowrap block">
                  Hon'ble Minister
                </span>
              </div>
            </div>
          </div>

          {/* Center: University Title */}
          <div className="flex flex-col items-center justify-center text-center flex-1 px-1 sm:px-3 py-1 order-2">
            <h2 className="text-slate-900 font-bold text-xs sm:text-sm md:text-[17px] lg:text-[19px] leading-snug">
              ವಿಶ್ವೇಶ್ವರಯ್ಯ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಬೆಳಗಾವಿ{" "}
              <span className="font-normal text-[10px] sm:text-xs md:text-[13px] text-slate-600 block sm:inline mt-0.5 sm:mt-0">
                (ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ)
              </span>
            </h2>
            <h3 className="text-slate-900 font-bold text-[10px] sm:text-xs md:text-[14px] lg:text-[16px] mt-0.5 sm:mt-1 leading-snug">
              Visvesvaraya Technological University, Belagavi{" "}
              <span className="font-normal text-[9px] sm:text-[11px] md:text-[12px] text-slate-500 block sm:inline mt-0.5 sm:mt-0">
                (State Technological University, Govt. of Karnataka)
              </span>
            </h3>
          </div>

          {/* Right side for desktop (hidden on mobile, visible md+) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0 order-3">
            {/* Shri D. K. Shivakumar */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="relative h-14 w-14 lg:h-16 lg:w-16 rounded-xl overflow-hidden border-2 border-[#166534] bg-white shadow-xs">
                <img
                  src={cmKarnatakaImg}
                  alt="Shri D. K. Shivakumar"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <span className="mt-1 font-sans text-[11px] lg:text-[12px] font-bold text-[#1e293b] leading-tight tracking-tight whitespace-nowrap block">
                Shri D. K. Shivakumar
              </span>
              <span className="font-sans text-[9px] lg:text-[10px] font-semibold text-[#0f766e] leading-tight mt-0.5 whitespace-nowrap block">
                Hon'ble Chief Minister
              </span>
              <span className="font-sans text-[8.5px] lg:text-[9.5px] font-medium text-slate-600 leading-tight block">
                of Karnataka
              </span>
            </div>

            {/* Shri U. T. Khader */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="relative h-14 w-14 lg:h-16 lg:w-16 rounded-xl overflow-hidden border-2 border-[#166534] bg-white shadow-xs">
                <img
                  src={utKhaderImg}
                  alt="Shri U. T. Khader"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <span className="mt-1 font-sans text-[11px] lg:text-[12px] font-bold text-[#1e293b] leading-tight tracking-tight whitespace-nowrap block">
                Shri U. T. Khader
              </span>
              <span className="font-sans text-[9px] lg:text-[10px] font-semibold text-[#0f766e] leading-tight mt-0.5 whitespace-nowrap block">
                Hon'ble Minister
              </span>
              <span className="font-sans text-[8.5px] lg:text-[9.5px] font-medium text-slate-600 leading-tight block">
                Minority Welfare
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
