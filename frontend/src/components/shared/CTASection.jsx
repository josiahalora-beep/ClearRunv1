import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Reusable bottom-of-page CTA band used on nearly every page. */
export function CTASection({ title, description }) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-xl bg-navy-950 px-5 py-10 text-center sm:px-12 sm:py-12">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative flex flex-col items-center gap-5">
          <h2 className="mobile-safe-text max-w-2xl font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
            {title || "Ready to see your records the way an inspector would?"}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-slate-300">
            {description || "Start a free records trial or get a sample proof packet mockup built from your own service data."}
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/try-free" data-testid="cta-band-primary-btn" className="w-full sm:w-auto">
              <Button size="lg" className="bg-white text-navy-950 hover:bg-slate-100 w-full sm:w-auto">
                Start Free Records Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/proof-mockup" data-testid="cta-band-secondary-btn" className="w-full sm:w-auto">
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
