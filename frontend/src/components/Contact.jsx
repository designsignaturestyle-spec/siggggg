import { useState } from "react";
import axios from "axios";
import { Phone, MessageCircle, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import useReveal from "../hooks/useReveal";
import { SITE, waLink } from "../lib/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const projectTypes = [
  "Home Interior",
  "Modular Kitchen",
  "Bedroom",
  "Living Room",
  "Office / Commercial",
  "Full Turnkey Project",
];

const budgetRanges = [
  "Under ₹1.5 Lakhs",
  "₹1.5L – ₹3L",
  "₹3L – ₹6L",
  "₹6L – ₹10L",
  "Above ₹10L",
];

export default function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    project_type: "",
    budget_range: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.project_type || !form.budget_range) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/leads`, form);
      toast.success("Thank you! We'll reach out within 24 hours.");
      setForm({ name: "", phone: "", project_type: "", budget_range: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border border-[#E5DFD3] focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none px-4 py-3.5 text-[#2D2D2D] placeholder:text-[#9c9c9c] transition-colors";

  return (
    <section
      data-testid="contact-section"
      id="contact"
      ref={ref}
      className="reveal relative py-24 md:py-32 bg-[#FAF6EC]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-medium">
              — Get in Touch
            </span>
            <h2
              data-testid="contact-title"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#2D2D2D] mt-5 leading-[1.05]"
            >
              Let's design your{" "}
              <span className="italic text-[#C5A059]">dream space.</span>
            </h2>
            <p className="mt-6 text-[#6B6B6B] leading-relaxed">
              Ready to transform your home or office? Get a free consultation
              today and bring your dream space to life — from empty space to
              dream place.
            </p>

            <div className="mt-10 space-y-5">
              <a
                data-testid="contact-phone"
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-4 group"
              >
                <span className="w-12 h-12 grid place-items-center border border-[#C5A059] text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                  <Phone size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B]">Phone</div>
                  <div className="font-display text-2xl text-[#2D2D2D] group-hover:text-[#C5A059] transition-colors">
                    {SITE.phone}
                  </div>
                </div>
              </a>

              <a
                data-testid="contact-whatsapp"
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="w-12 h-12 grid place-items-center border border-[#C5A059] text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-colors">
                  <MessageCircle size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B]">WhatsApp</div>
                  <div className="font-display text-2xl text-[#2D2D2D] group-hover:text-[#C5A059] transition-colors">
                    {SITE.phone}
                  </div>
                </div>
              </a>

              <div data-testid="contact-location" className="flex items-center gap-4">
                <span className="w-12 h-12 grid place-items-center border border-[#C5A059] text-[#C5A059]">
                  <MapPin size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B]">Studio</div>
                  <div className="font-display text-2xl text-[#2D2D2D]">{SITE.location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              data-testid="contact-form"
              onSubmit={submit}
              className="bg-white border border-[#E5DFD3] p-8 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 block">
                    Name *
                  </label>
                  <input
                    data-testid="contact-input-name"
                    className={inputCls}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={update("name")}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 block">
                    Phone *
                  </label>
                  <input
                    data-testid="contact-input-phone"
                    className={inputCls}
                    placeholder="+91 9XXXX XXXXX"
                    value={form.phone}
                    onChange={update("phone")}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 block">
                    Project Type *
                  </label>
                  <select
                    data-testid="contact-input-project-type"
                    className={inputCls}
                    value={form.project_type}
                    onChange={update("project_type")}
                    required
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 block">
                    Budget Range *
                  </label>
                  <select
                    data-testid="contact-input-budget"
                    className={inputCls}
                    value={form.budget_range}
                    onChange={update("budget_range")}
                    required
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-2 block">
                    Message
                  </label>
                  <textarea
                    data-testid="contact-input-message"
                    rows={5}
                    className={inputCls}
                    placeholder="Tell us about your space, style preferences, and timeline..."
                    value={form.message}
                    onChange={update("message")}
                  />
                </div>
              </div>

              <button
                data-testid="contact-submit"
                type="submit"
                disabled={submitting}
                className="mt-8 w-full md:w-auto bg-[#C5A059] hover:bg-[#B38F48] disabled:opacity-60 text-white px-10 py-4 flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase transition-colors"
              >
                {submitting ? "Sending..." : "Book Free Consultation"}
                <Send size={14} strokeWidth={1.5} />
              </button>
              <p className="mt-4 text-xs text-[#6B6B6B]">
                We respect your privacy. Your details will only be used to
                contact you about your project.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
