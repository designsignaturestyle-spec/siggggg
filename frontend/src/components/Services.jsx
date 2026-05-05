import {
  Home,
  ChefHat,
  BedDouble,
  Sofa,
  Building2,
  Lightbulb,
  Armchair,
  KeyRound,
} from "lucide-react";
import useReveal from "../hooks/useReveal";

const services = [
  { icon: Home, title: "Home Interior Design", desc: "Complete design solutions for apartments, villas, and houses." },
  { icon: ChefHat, title: "Modular Kitchen", desc: "Smart, modern, and space-saving kitchen designs." },
  { icon: BedDouble, title: "Bedroom Design", desc: "Comfortable and elegant bedroom interiors." },
  { icon: Sofa, title: "Living Room Design", desc: "Stylish and welcoming living spaces." },
  { icon: Building2, title: "Office & Commercial", desc: "Professional and functional workspace designs." },
  { icon: Lightbulb, title: "False Ceiling & Lighting", desc: "Modern ceiling designs with the perfect lighting setup." },
  { icon: Armchair, title: "Furniture & Decor", desc: "Custom furniture and decor solutions." },
  { icon: KeyRound, title: "Full Turnkey Projects", desc: "End-to-end interior work handled by our expert team." },
];

export default function Services() {
  const ref = useReveal();
  return (
    <section
      data-testid="services-section"
      id="services"
      ref={ref}
      className="reveal relative py-24 md:py-32 bg-white border-y border-[#E5DFD3]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-medium">
              — What We Do
            </span>
            <h2
              data-testid="services-title"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2D2D2D] mt-5 leading-[1.05]"
            >
              Crafted services for every
              <br />
              <span className="italic text-[#C5A059]">corner of your home.</span>
            </h2>
          </div>
          <p className="text-[#6B6B6B] max-w-md text-base leading-relaxed">
            Eight signature offerings — designed to cover every interior need,
            beautifully integrated under one roof.
          </p>
        </div>

        <div data-testid="services-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E5DFD3]">
          {services.map((s, i) => (
            <div
              key={s.title}
              data-testid={`service-card-${i}`}
              className="group relative bg-white p-8 md:p-10 hover:bg-[#FAF6EC] transition-colors duration-500"
            >
              <div className="w-12 h-12 grid place-items-center border border-[#C5A059] text-[#C5A059] mb-6 group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                <s.icon size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl text-[#2D2D2D] mb-3 leading-tight">
                {s.title}
              </h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.desc}</p>
              <div className="mt-6 text-[10px] tracking-[0.3em] uppercase text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">
                0{i + 1} / 0{services.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
