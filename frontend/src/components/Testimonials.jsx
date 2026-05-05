import { Quote, Star } from "lucide-react";
import useReveal from "../hooks/useReveal";

const testimonials = [
  { quote: "Amazing work within my budget. Highly professional team!", name: "Priya R.", role: "Apartment Owner, Whitefield" },
  { quote: "They designed my home exactly how I imagined. Every detail felt curated.", name: "Arjun M.", role: "Villa Owner, Sarjapur" },
  { quote: "On-time delivery and great quality materials. Truly turnkey.", name: "Sneha K.", role: "3BHK, Indiranagar" },
  { quote: "Best interior designers for affordable pricing — without sacrificing taste.", name: "Vikram S.", role: "Office Project, MG Road" },
];

export default function Testimonials() {
  const ref = useReveal();
  return (
    <section
      data-testid="testimonials-section"
      id="testimonials"
      ref={ref}
      className="reveal relative py-24 md:py-32 bg-white border-y border-[#E5DFD3]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mb-14">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-medium">
            — Testimonials
          </span>
          <h2
            data-testid="testimonials-title"
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2D2D2D] mt-5 leading-[1.05]"
          >
            What our clients say after the
            <br />
            <span className="italic text-[#C5A059]">final reveal.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              data-testid={`testimonial-${i}`}
              className="relative bg-[#FAF6EC] border border-[#E5DFD3] p-8 md:p-10 hover:border-[#C5A059] transition-colors"
            >
              <Quote
                size={36}
                strokeWidth={1}
                className="text-[#C5A059] opacity-30 absolute top-6 right-6"
              />
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, k) => (
                  <Star
                    key={k}
                    size={14}
                    className="fill-[#C5A059] text-[#C5A059]"
                    strokeWidth={1}
                  />
                ))}
              </div>
              <blockquote className="font-display text-2xl md:text-3xl text-[#2D2D2D] leading-snug">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-7 pt-5 border-t border-[#E5DFD3]">
                <div className="text-[#2D2D2D] tracking-wide">{t.name}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] mt-1">
                  {t.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
