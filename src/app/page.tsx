import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import CollectionShowcase from "@/components/ui/CollectionShowcase";
import FeaturedProducts from "@/components/ui/FeaturedProducts";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbf9f4] text-foreground">
      <Navbar />
      <Hero />
      
      {/* Visual Collections Grid */}
      <CollectionShowcase />

      {/* Actual Product Items */}
      <FeaturedProducts />

      {/* Featured Collection: The Diamond Edit */}
      <section className="section-spacing container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-24">
        <div className="space-y-8 lg:order-2">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#B08D2E] mb-4 block">
            The Diamond Edit
          </span>
          <h2 className="text-4xl lg:text-6xl font-serif leading-tight">
            Light as <br /> 
            <span className="italic pl-12 lg:pl-16 font-light opacity-80">Nature intended.</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-md font-light leading-relaxed">
            Every piece in our Diamond Edit is a testament to the Earth’s most 
            enduring masterpiece. Meticulously cut to maximize every photon 
            of light, these jewels are architectural in their precision.
          </p>
          <div className="pt-4">
            <Link href="/shop" className="btn-outline group flex items-center gap-2 w-fit uppercase text-[10px] tracking-widest font-bold">
              Explore The Edit <ChevronRight size={14} />
            </Link>
          </div>
        </div>
        
        <div className="relative aspect-[3/4] bg-muted overflow-hidden flex items-center justify-center lg:order-1">
          <img 
             src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop" 
             alt="The Diamond Edit" 
             className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      </section>

      {/* The Demi-Fine Difference (Education) */}
      <section className="bg-foreground text-white py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#121212] -skew-x-12 translate-x-1/2 opacity-50" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">The Vedika Ethos</span>
              <h2 className="text-4xl lg:text-6xl font-serif">The <span className="italic font-light opacity-60">Demi-Fine</span> Difference</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Materiality</h4>
                <p className="text-sm font-light leading-relaxed opacity-60">
                   We use only 925 Sterling Silver and 18K Gold Plating, ensuring a luxury feel that lasts beyond seasons.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Anti-Tarnish</h4>
                <p className="text-sm font-light leading-relaxed opacity-60">
                   Every piece is coated with specialized protective layers to maintain its ethereal brilliance against daily wear.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Craftsmanship</h4>
                <p className="text-sm font-light leading-relaxed opacity-60">
                   Bridging the gap between high-fashion and fine jewelry with architectural precision and ethereal form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
