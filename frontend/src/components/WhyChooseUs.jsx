import { Award, Gem, Layers, ShieldCheck, Clock, Wrench } from "lucide-react";
import useReveal from "../hooks/useReveal";

const reasons = [
  { icon: Award, title: "Affordable Packages", desc: "Curated tiers for every budget — no compromise on craft." },
  { icon: Gem, title: "Premium Quality Materials", desc: "Hand-picked finishes, fabrics, and hardware that last." },
  { icon: Layers, title: "Customized Designs", desc: "Every project is tailored to your lifestyle and taste." },
  { icon: ShieldCheck, title: "Transparent Pricing", desc: "Clear quotes. No surprises, no hidden costs." },
  { icon: Clock, title: "On-Time Delivery", desc: "We commit to timelines and we deliver — every project." },
  { icon: Wrench, title: "Turnkey Execution", desc: "From design to handover, we handle everything." },
];

export default function WhyChooseUs() {
  const ref = useReveal();
  return (
    <section
      data-testid="why-choose-us"
      id="why"
      ref={ref}
      className="reveal relative py-24 md:py-32 bg-[#2D2D2D] text-[#FAF6EC]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#D9BE85] font-medium">
            — Why Choose Us
          </span>
          <h2
            data-testid="why-title"
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mt-5 leading-[1.05]"
          >
            Why clients trust us with their
            <br />
            <span className="italic text-[#D9BE85]">most personal spaces.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#3a3a3a]">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              data-testid={`why-item-${i}`}
              className="group bg-[#2D2D2D] hover:bg-[#1f1f1f] p-8 md:p-10 transition-colors duration-500"
            >
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 grid place-items-center border border-[#C5A059] text-[#D9BE85] shrink-0 group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                  <r.icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[#FAF6EC] leading-tight">
                    {r.title}
                  </h3>
                  <p className="text-sm text-[#FAF6EC]/70 mt-3 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
