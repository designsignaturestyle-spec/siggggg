import { useState } from "react";
import useReveal from "../hooks/useReveal";

const items = [
  { cat: "Premium", title: "Halo Lounge", img: "https://customer-assets.emergentagent.com/job_design-spaces-luxury/artifacts/i28tcz3q_WhatsApp%20Image%202026-05-05%20at%204.36.52%20PM.jpeg" },
  { cat: "Premium", title: "Diamond Study Wall", img: "https://customer-assets.emergentagent.com/job_design-spaces-luxury/artifacts/e7vcjfzj_WhatsApp%20Image%202026-05-05%20at%204.37.40%20PM.jpeg" },
  { cat: "Premium", title: "Skyline TV Lounge", img: "https://customer-assets.emergentagent.com/job_design-spaces-luxury/artifacts/6fhk748c_WhatsApp%20Image%202026-05-05%20at%204.44.00%20PM000000.jpeg" },
  { cat: "Mid-Range", title: "Triangular Accent Bedroom", img: "https://customer-assets.emergentagent.com/job_design-spaces-luxury/artifacts/qkpi61wh_WhatsApp%20Image%202026-05-05%20at%204.43.59%20PM.jpeg" },
  { cat: "Mid-Range", title: "Beige Dining Suite", img: "https://customer-assets.emergentagent.com/job_design-spaces-luxury/artifacts/20p0c5zy_WhatsApp%20Image%202026-05-05%20at%204.44.00%20PM.jpeg" },
  { cat: "Mid-Range", title: "Ivory Modular Kitchen", img: "https://static.prod-images.emergentagent.com/jobs/94e983b5-8972-4845-8e05-3d289e91afc7/images/9c73c1fe2d41c5b650968aedf01153cee9da35d24603e5ce79e9a8a875b9fe39.png" },
];

const filters = ["All", "Budget", "Mid-Range", "Premium"];

export default function Portfolio() {
  const ref = useReveal();
  const [active, setActive] = useState("All");
  const visible = active === "All" ? items : items.filter((i) => i.cat === active);

  return (
    <section
      data-testid="portfolio-section"
      id="portfolio"
      ref={ref}
      className="reveal relative py-24 md:py-32 bg-[#FAF6EC]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-medium">
              — Our Projects
            </span>
            <h2
              data-testid="portfolio-title"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2D2D2D] mt-5 leading-[1.05]"
            >
              Empty spaces, turned into
              <br />
              <span className="italic text-[#C5A059]">beautiful experiences.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" data-testid="portfolio-filters">
            {filters.map((f) => (
              <button
                key={f}
                data-testid={`portfolio-filter-${f.toLowerCase()}`}
                onClick={() => setActive(f)}
                className={`px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase border transition-colors ${
                  active === f
                    ? "bg-[#2D2D2D] text-[#FAF6EC] border-[#2D2D2D]"
                    : "bg-transparent text-[#2D2D2D] border-[#E5DFD3] hover:border-[#C5A059] hover:text-[#C5A059]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div data-testid="portfolio-gallery" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p, i) => (
            <figure
              key={`${p.title}-${i}`}
              data-testid={`portfolio-item-${i}`}
              className="group relative overflow-hidden bg-white border border-[#E5DFD3]"
            >
              <div className="overflow-hidden h-72 md:h-80">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-5 flex items-center justify-between border-t border-[#E5DFD3]">
                <div>
                  <div className="font-display text-xl text-[#2D2D2D]">{p.title}</div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#C5A059] mt-1">
                    {p.cat}
                  </div>
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B]">
                  0{i + 1}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
