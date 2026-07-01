import React from "react";
import { Building2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoadmapCard } from "@/components/shared/RoadmapCard";
import { CTASection } from "@/components/shared/CTASection";

export default function CityView() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Roadmap"
          title="CityView"
          description="Municipal-facing visibility into regulated service compliance across a city or county — planned, not yet built."
          align="center"
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <RoadmapCard
            icon={Building2}
            title="CityView"
            description="CityView will give municipalities a standardized, opt-in view of pump-out and disposal activity across participating businesses — without requiring inspectors to chase paperwork location by location."
            bullets={[
              "Opt-in visibility for participating businesses only",
              "Standardized summary, not raw record access",
              "Built on top of existing City Export functionality",
              "No claim of official city partnership or approval",
            ]}
          />
        </div>
      </section>
      <CTASection title="Want to be first to try CityView?" description="Join the pilot program and we'll reach out when municipal features are ready to test." />
    </Layout>
  );
}
