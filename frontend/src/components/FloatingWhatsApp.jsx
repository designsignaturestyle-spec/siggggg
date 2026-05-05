import { MessageCircle } from "lucide-react";
import { waLink } from "../lib/site";

export default function FloatingWhatsApp() {
  return (
    <a
      data-testid="whatsapp-float"
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-40 bottom-6 right-6 md:bottom-8 md:right-8 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <span className="relative flex items-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl transition-all">
        <MessageCircle size={20} strokeWidth={1.8} />
        <span className="hidden sm:inline text-xs tracking-[0.18em] uppercase font-medium">
          Chat with us
        </span>
      </span>
    </a>
  );
}
