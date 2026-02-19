import React from "react";

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  return (
    <div className="bg-[#020C0B] relative overflow-hidden py-16 sm:py-20">
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-3 gap-10 items-start">
            {/* Col 1 – Logo + Social */}
            <div>
              <div className="font-logo font-extrabold text-2xl mb-5">
                <span className="text-[#0A9087]">Hyper</span>
                <span className="text-white">Picks.ai</span>
              </div>
              <div className="flex gap-3">
                {[<FacebookIcon />, <TwitterIcon />, <InstagramIcon />].map(
                  (icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#0A9087]/10 text-[#0A9087] border border-[#0A9087]/20 hover:bg-[#0A9087]/20 hover:border-[#0A9087]/50 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {icon}
                    </a>
                  ),
                )}
              </div>
            </div>

            {/* Col 2 – Contact */}
            <div>
              <p className="font-logo font-extrabold text-[12px] tracking-widest uppercase text-[#0A9087] mb-3">
                Contact
              </p>
              <div className="h-[2px] w-8 bg-[#0A9087] rounded-full mb-4" />
              <div className="font-logo font-normal text-[14px] leading-[26px] text-white/60">
                staff@hyperpicks.ai
                <br />
                012-345-6789
                <br />
                Fort Lauderdale, FL
              </div>
            </div>

            {/* Col 3 – Join Today */}
            <div>
              <p className="font-logo font-extrabold text-[12px] tracking-widest uppercase text-[#0A9087] mb-3">
                Join Today
              </p>
              <div className="h-[2px] w-8 bg-[#0A9087] rounded-full mb-4" />
              <p className="font-logo font-normal text-[14px] leading-[24px] text-white/60 mb-5">
                Get the edge you need for better picks.
              </p>
              <button className="w-[150px] h-[44px] rounded-full border border-[#0A9087] font-logo text-white font-extrabold text-[14px] leading-none flex justify-center items-center cursor-pointer hover:bg-[#087a72] hover:shadow-[0_0_25px_rgba(10,144,135,0.4)] transition-all duration-300">
                JOIN NOW
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#0A9087]/15 my-10" />

          {/* Bottom bar */}
          <div className="flex justify-between items-center">
            <p className="font-logo font-medium text-[12px] text-white/30">
              © 2026 HyperPicks.ai | All rights reserved
            </p>
            <div className="flex gap-7">
              <a
                href="#"
                className="font-logo font-medium text-[12px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-logo font-medium text-[12px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="block sm:hidden">
          {/* Logo + Social row */}
          <div className="flex justify-between items-center mb-8">
            <div className="font-logo font-extrabold text-xl">
              <span className="text-[#0A9087]">Hyper</span>
              <span className="text-white">Picks.ai</span>
            </div>
            <div className="flex gap-2.5">
              {[<FacebookIcon />, <TwitterIcon />, <InstagramIcon />].map(
                (icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#0A9087]/10 text-[#0A9087] border border-[#0A9087]/20 hover:bg-[#0A9087]/20 transition-all duration-200"
                  >
                    {icon}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="mb-7">
            <p className="font-logo font-extrabold text-[11px] tracking-widest uppercase text-[#0A9087] mb-2.5">
              Contact
            </p>
            <div className="h-[2px] w-8 bg-[#0A9087] rounded-full mb-3" />
            <div className="font-logo font-normal text-[13px] leading-[24px] text-white/60">
              staff@hyperpicks.ai
              <br />
              012-345-6789
              <br />
              Fort Lauderdale, FL
            </div>
          </div>

          {/* Join Today */}
          <div className="mb-9">
            <p className="font-logo font-extrabold text-[11px] tracking-widest uppercase text-[#0A9087] mb-2.5">
              Join Today
            </p>
            <div className="h-[2px] w-8 bg-[#0A9087] rounded-full mb-3" />
            <p className="font-logo font-normal text-[13px] leading-[22px] text-white/60 mb-5">
              Get the edge you need for better picks.
            </p>
            <button className="w-[150px] h-[44px] rounded-full border border-[#0A9087] font-logo text-white font-extrabold text-[14px] leading-none flex justify-center items-center cursor-pointer hover:bg-[#087a72] hover:shadow-[0_0_25px_rgba(10,144,135,0.4)] transition-all duration-300">
              JOIN NOW
            </button>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#0A9087]/15 mb-6" />

          {/* Bottom */}
          <div className="text-center">
            <p className="font-logo font-medium text-[11px] text-white/30 mb-3">
              © 2026 HyperPicks.ai | All rights reserved
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="#"
                className="font-logo font-medium text-[11px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-logo font-medium text-[11px] text-white/50 hover:text-[#0A9087] transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
