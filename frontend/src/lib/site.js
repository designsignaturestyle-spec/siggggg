export const SITE = {
  brand: "Signature Style Interiors",
  tagline: "From Empty Space to Dream Place",
  phone: "8748055124",
  whatsapp: "918748055124", // E.164-ish for wa.me (India country code)
  whatsappMessage:
    "Hello! I'm interested in your interior design services. I'd like to know more about a free consultation.",
  email: "designsignaturestyle@gmail.com",
  location: "Bangalore, Karnataka",
  socials: {
    instagram: "https://www.instagram.com/signaturestyleinteriors01/",
    whatsapp: "https://wa.me/918748055124",
  },
};

export const waLink = (text) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    text || SITE.whatsappMessage
  )}`;
