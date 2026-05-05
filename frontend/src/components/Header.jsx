import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "../lib/site";

const links = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "pricing", label: "Pricing" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF6EC]/85 backdrop-blur-xl border-b border-[#E5DFD3]/70"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
        <button
          data-testid="brand-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group shrink-0"
        >
          <span className="w-9 h-9 grid place-items-center border border-[#C5A059] text-[#C5A059] font-display text-xl tracking-tight group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
            S
          </span>
          <div className="text-left leading-tight whitespace-nowrap hidden md:block">
            <div className="font-display text-base xl:text-lg tracking-wide text-[#2D2D2D]">
              Signature Style
            </div>
            <div className="text-[9px] tracking-[0.25em] uppercase text-[#C5A059]">
              Interiors · Ivory & Gold
            </div>
          </div>
        </button>

        <nav className="hidden xl:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-${l.id}`}
              onClick={() => go(l.id)}
              className="gold-line text-sm tracking-[0.18em] uppercase text-[#2D2D2D] hover:text-[#C5A059] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <button
            data-testid="header-cta"
            onClick={() => go("contact")}
            className="bg-[#C5A059] hover:bg-[#B38F48] text-white px-5 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors whitespace-nowrap"
          >
            Free Consultation
          </button>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-10 h-10 grid place-items-center border border-[#E5DFD3] text-[#2D2D2D] shrink-0"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="lg:hidden border-t border-[#E5DFD3] bg-[#FAF6EC]"
        >
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <button
                key={l.id}
                data-testid={`mobile-nav-${l.id}`}
                onClick={() => go(l.id)}
                className="text-left text-sm tracking-[0.18em] uppercase text-[#2D2D2D] py-2"
              >
                {l.label}
              </button>
            ))}
            <button
              data-testid="mobile-header-cta"
              onClick={() => go("contact")}
              className="bg-[#C5A059] hover:bg-[#B38F48] text-white py-3 text-xs tracking-[0.22em] uppercase mt-2"
            >
              Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
