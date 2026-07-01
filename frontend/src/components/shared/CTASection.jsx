import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Reusable bottom-of-page CTA band used on nearly every page. */
export function CTASection({ title, description }) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="rounded-2xl bg-navy-950 px-6 py-14 sm:px-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white max-w-2xl">
            {title || "Ready to see your records the way an inspector would?"}
          </h2>
          <p className="text-slate-300 max-w-xl text-base">
            {description || "Start a free records trial or get a sample proof packet mockup built from your own service data."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link to="/try-free" data-testid="cta-band-primary-btn">
              <Button size="lg" className="bg-white text-navy-950 hover:bg-slate-100 w-full sm:w-auto">
                Start Free Records Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/proof-mockup" data-testid="cta-band-secondary-btn">
              <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto">
                Get a Free Proof Packet Mockup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
