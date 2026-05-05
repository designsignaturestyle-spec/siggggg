import { ArrowUpRight, Sparkles } from "lucide-react";

const HERO_IMG =
  "https://static.prod-images.emergentagent.com/jobs/94e983b5-8972-4845-8e05-3d289e91afc7/images/00340e670245c19f856df3e334d695a3e3110f37621e27c9fcf6d9fa86f07c8a.png";

export default function Hero() {
  const go = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      data-testid="hero-section"
      id="home"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <img
        src={HERO_IMG}
        alt="Italian ivory living room interior with gold accents"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/80 via-[#1a1714]/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/60 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-40 md:pt-48 pb-24 min-h-screen flex flex-col justify-center">
        <div className="max-w-3xl">
          <div
            data-testid="hero-eyebrow"
            className="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-[#C5A059]/60 backdrop-blur-md bg-white/5"
          >
            <Sparkles size={14} className="text-[#D9BE85]" strokeWidth={1.5} />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#F5EFE0]">
              Signature Style Interiors
            </span>
          </div>

          <h1
            data-testid="hero-headline"
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-[#FAF6EC] leading-[0.95]"
          >
            Transforming Spaces
            <br />
            into{" "}
            <span className="italic text-[#D9BE85]">Signature Style</span>
          </h1>

          <p
            data-testid="hero-subheadline"
            className="mt-8 text-lg md:text-xl text-[#F5EFE0]/90 max-w-2xl leading-relaxed"
          >
            Affordable to premium interior designs with complete turnkey
            solutions. From budget-friendly homes to luxury dream spaces — we
            design and execute everything, beautifully and on time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              data-testid="hero-cta-consultation"
              onClick={() => go("contact")}
              className="group bg-[#C5A059] hover:bg-[#B38F48] text-white px-8 py-4 flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase transition-colors"
            >
              Get Free Consultation
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                strokeWidth={1.5}
              />
            </button>
            <button
              data-testid="hero-cta-portfolio"
              onClick={() => go("portfolio")}
              className="border border-[#FAF6EC]/60 hover:border-[#FAF6EC] text-[#FAF6EC] hover:bg-[#FAF6EC] hover:text-[#2D2D2D] px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors"
            >
              View Our Work
            </button>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl">
            {[
              { k: "200+", v: "Projects" },
              { k: "10+", v: "Years" },
              { k: "100%", v: "On-time" },
            ].map((s) => (
              <div
                key={s.v}
                data-testid={`hero-stat-${s.v.toLowerCase()}`}
                className="border-l border-[#C5A059]/60 pl-4"
              >
                <div className="font-display text-3xl md:text-4xl text-[#FAF6EC]">
                  {s.k}
                </div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#D9BE85] mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#FAF6EC]/70">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#FAF6EC]/70 to-transparent" />
      </div>
    </section>
  );
}
