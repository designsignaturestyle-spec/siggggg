import { Instagram, MessageCircle, ArrowUp } from "lucide-react";
import { SITE, waLink } from "../lib/site";

export default function Footer() {
  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <footer
      data-testid="footer"
      className="relative bg-[#1f1f1f] text-[#FAF6EC] pt-20 pb-10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="font-display text-3xl md:text-4xl text-[#FAF6EC] leading-tight">
              Signature Style
              <br />
              <span className="italic text-[#D9BE85]">Interiors.</span>
            </div>
            <p className="mt-5 text-sm text-[#FAF6EC]/70 max-w-md leading-relaxed">
              Affordable to premium interior solutions. From the first sketch
              to the final reveal — beautifully, professionally, and on time.
            </p>
            <div className="mt-6 text-[10px] tracking-[0.3em] uppercase text-[#D9BE85]">
              "{SITE.tagline}"
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#D9BE85] mb-4">Studio</div>
            <ul className="space-y-2 text-sm text-[#FAF6EC]/80">
              <li>{SITE.location}</li>
              <li>
                <a className="hover:text-[#D9BE85]" href={`tel:${SITE.phone}`}>{SITE.phone}</a>
              </li>
              <li>
                <a className="hover:text-[#D9BE85]" href={waLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp · {SITE.phone}
                </a>
              </li>
              <li>
                <a className="hover:text-[#D9BE85] break-all" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#D9BE85] mb-4">Explore</div>
            <ul className="space-y-2 text-sm text-[#FAF6EC]/80">
              {["About", "Services", "Portfolio", "Pricing", "Contact"].map((l) => (
                <li key={l}>
                  <a className="hover:text-[#D9BE85]" href={`#${l.toLowerCase()}`}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#D9BE85] mb-4">Follow</div>
            <div className="flex gap-3">
              <a
                data-testid="footer-instagram"
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 grid place-items-center border border-[#FAF6EC]/30 hover:border-[#D9BE85] hover:text-[#D9BE85] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                data-testid="footer-facebook"
                href={SITE.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 grid place-items-center border border-[#FAF6EC]/30 hover:border-[#D9BE85] hover:text-[#D9BE85] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} strokeWidth={1.5} />
              </a>
              <a
                data-testid="footer-whatsapp"
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 grid place-items-center border border-[#FAF6EC]/30 hover:border-[#D9BE85] hover:text-[#D9BE85] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-[#FAF6EC]/50">
          <div>© {new Date().getFullYear()} Signature Style Interiors — All rights reserved.</div>
          <button
            data-testid="footer-back-to-top"
            onClick={goTop}
            className="flex items-center gap-2 hover:text-[#D9BE85] transition-colors tracking-[0.25em] uppercase"
          >
            Back to top <ArrowUp size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
