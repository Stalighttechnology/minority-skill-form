import { Mail, Phone, MapPin, Globe, Facebook, Twitter } from "lucide-react";
import circularLogo from "@/assets/vtu_logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#333333] bg-[#222222] text-slate-200">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 items-start">
          {/* Brand/About Section */}
          <div className="space-y-4 md:col-span-1">
            <img
              src={circularLogo}
              alt="VTU Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                VTU - Skill Development Centres (SDC)
              </h4>
              <p className="text-xs leading-relaxed text-slate-400">
                Empowering youth and engineering candidates with industry-ready, job-oriented
                skill training programmes across VTU Skill Development Centres.
              </p>
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                <span>
                  <strong>Office</strong>
                  <br />
                  No. 130, 1st Block, Dr. Rajkumar Road
                  <br />
                  Rajajinagar, Bengaluru-560010
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-lime" />
                <a href="mailto:info@eduforcareer.com" className="hover:text-white transition-colors">
                  info@eduforcareer.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-lime" />
                <a href="tel:+917760826949" className="hover:text-white transition-colors">
                  +91-77608 26949
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0 text-lime" />
                <a href="https://vtu.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  vtu.ac.in
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Follow Us
            </h4>
            <p className="text-xs text-slate-400">Stay updated with the latest programmes and announcements.</p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/vtuinfo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-[#333333] hover:bg-[#4267B2] hover:text-white transition-all text-slate-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/vtuinfo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-[#333333] hover:bg-[#1DA1F2] hover:text-white transition-all text-slate-300"
                aria-label="Twitter (X)"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#333333]" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Visvesvaraya Technological University. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-slate-600">Minority Project Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
