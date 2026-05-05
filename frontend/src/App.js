import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import WhyChooseUs from "./components/WhyChooseUs";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const Landing = () => {
  useEffect(() => {
    document.title = "Signature Style Interiors — Italian Ivory Luxury Interiors, Bangalore";
  }, []);

  return (
    <main data-testid="landing-page" className="bg-[#FAF6EC] min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <WhyChooseUs />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#FAF6EC",
                color: "#2D2D2D",
                border: "1px solid #C5A059",
                borderRadius: 0,
                fontFamily: "Outfit, sans-serif",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
