import { Check } from "lucide-react";
import useReveal from "../hooks/useReveal";

const tiers = [
  {
    name: "Basic",
    price: "₹1.5 Lakhs",
    tag: "Budget-Friendly Interiors",
    features: [
      "Essential design consultation",
      "Modular kitchen basics",
      "Bedroom & living essentials",
      "Standard finish materials",
      "On-time turnkey handover",
    ],
    featured: false,
  },
  {
    name: "Standard",
    price: "₹3 Lakhs",
    tag: "Balanced Design + Quality",
    features: [
      "Full home interior design",
      "Premium modular kitchen",
      "False ceiling & lighting plan",
      "Custom furniture options",
      "Mid-range finishes & decor",
      "Project manager assigned",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "₹6 Lakhs",
    tag: "Luxury, High-End Finishes",
    features: [
      "Bespoke design concepts",
      "Imported finishes & fabrics",
      "Designer lighting & decor",
      "Custom furniture & joinery",
      "Smart home integration",
      "White-glove turnkey delivery",
    ],
    featured: false,
  },
];

export default function Pricing() {
  const ref = useReveal();
  const go = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section
      data-testid="pricing-section"
      id="pricing"
      ref={ref}
      className="reveal relative py-24 md:py-32 bg-[#FAF6EC]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-medium">
            — Our Packages
          </span>
          <h2
            data-testid="pricing-title"
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2D2D2D] mt-5 leading-[1.05]"
          >
            Pricing tailored to{" "}
            <span className="italic text-[#C5A059]">your dream.</span>
          </h2>
          <p className="mt-5 text-[#6B6B6B]">
            Transparent tiers — choose the experience that fits your vision and
            budget. *Prices may vary based on project size.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              data-testid={`pricing-tier-${t.name.toLowerCase()}`}
              className={`relative flex flex-col p-8 md:p-10 transition-all duration-500 ${
                t.featured
                  ? "bg-white border-2 border-[#C5A059] md:-translate-y-4 shadow-[0_30px_60px_-30px_rgba(197,160,89,0.4)]"
                  : "bg-white border border-[#E5DFD3] hover:border-[#C5A059]/60"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-white text-[10px] tracking-[0.3em] uppercase px-4 py-1.5">
                  Most Popular
                </div>
              )}
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] mb-3">
                0{i + 1} · {t.tag}
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-[#2D2D2D]">
                {t.name}
              </h3>
              <div className="mt-5 mb-7 border-y border-[#E5DFD3] py-5">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#6B6B6B]">
                  Starting from
                </span>
                <div className="font-display text-4xl md:text-5xl text-[#2D2D2D] mt-1">
                  {t.price}
                  <span className="text-base text-[#6B6B6B] font-body">*</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-[#2D2D2D]"
                  >
                    <Check
                      size={16}
                      className="text-[#C5A059] mt-0.5 shrink-0"
                      strokeWidth={1.8}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                data-testid={`pricing-cta-${t.name.toLowerCase()}`}
                onClick={go}
                className={`w-full py-4 text-xs tracking-[0.25em] uppercase transition-colors ${
                  t.featured
                    ? "bg-[#C5A059] hover:bg-[#B38F48] text-white"
                    : "border border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-[#FAF6EC]"
                }`}
              >
                Book {t.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
