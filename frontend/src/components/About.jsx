import { Check } from "lucide-react";
import useReveal from "../hooks/useReveal";

const ABOUT_IMG =
  "https://static.prod-images.emergentagent.com/jobs/94e983b5-8972-4845-8e05-3d289e91afc7/images/9c73c1fe2d41c5b650968aedf01153cee9da35d24603e5ce79e9a8a875b9fe39.png";

const highlights = [
  "Budget to Premium Designs",
  "100% Customized Interiors",
  "On-Time Project Delivery",
  "Complete Turnkey Solutions",
];

export default function About() {
  const ref = useReveal();
  return (
    <section
      data-testid="about-section"
      id="about"
      ref={ref}
      className="reveal relative py-24 md:py-32 bg-[#FAF6EC]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 border border-[#C5A059]/40 -z-0 hidden md:block" />
            <img
              src={ABOUT_IMG}
              alt="Premium ivory and gold modular kitchen"
              className="relative w-full h-[460px] md:h-[560px] object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#2D2D2D] text-[#FAF6EC] px-6 py-5 hidden md:block">
              <div className="font-display text-3xl text-[#D9BE85]">10+</div>
              <div className="text-[10px] tracking-[0.25em] uppercase mt-1">
                Years of Craft
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <span
              data-testid="about-eyebrow"
              className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-medium"
            >
              — Who We Are
            </span>
            <h2
              data-testid="about-title"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2D2D2D] mt-5 leading-[1.05]"
            >
              Every space deserves a<br />
              <span className="italic text-[#C5A059]">unique identity.</span>
            </h2>
            <p className="mt-7 text-[#6B6B6B] text-lg leading-relaxed max-w-2xl">
              At Signature Style Interiors, we craft stylish, functional, and
              affordable interiors tailored to your lifestyle and budget. From
              the first sketch to the final styling — we handle every detail
              with European precision and Italian grace.
            </p>
            <p className="mt-4 text-[#6B6B6B] text-base leading-relaxed max-w-2xl">
              From concept design to final execution, we handle everything —
              so you don't have to worry about anything.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h) => (
                <div
                  key={h}
                  data-testid={`about-highlight-${h.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-3 border-l-2 border-[#C5A059] pl-4 py-2"
                >
                  <Check size={16} className="text-[#C5A059]" strokeWidth={1.8} />
                  <span className="text-[#2D2D2D] tracking-wide">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
