import React from "react";
import { LineChart } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoadmapCard } from "@/components/shared/RoadmapCard";
import { CTASection } from "@/components/shared/CTASection";

export default function Intelligence() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Roadmap"
          title="Infrastructure Intelligence"
          description="Aggregate, anonymized insight into regulated service trends across regions — the long-term vision for ClearRun, planned, not yet built."
          align="center"
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <RoadmapCard
            icon={LineChart}
            title="Infrastructure Intelligence"
            description="As ClearRun expands beyond grease-trap / FOG into septic, portable sanitation, and other liquid-waste services, Infrastructure Intelligence will surface trends across regions — helping operators and municipalities understand service gaps at scale."
            bullets={[
              "Cross-category trend visibility (FOG, septic, portable sanitation)",
              "Aggregate insight, not individual surveillance",
              "Built on top of ProofGraph and CityView data",
              "No compliance, EPA, or regulatory certification claims",
            ]}
          />
        </div>
      </section>
      <CTASection title="Building toward infrastructure-wide visibility" description="Start with proof packets today — Infrastructure Intelligence builds on the same record foundation." />
    </Layout>
  );
}
