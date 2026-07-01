import React from "react";
import { Share2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoadmapCard } from "@/components/shared/RoadmapCard";
import { CTASection } from "@/components/shared/CTASection";

export default function ProofGraph() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Roadmap"
          title="ProofGraph"
          description="A relationship map connecting customers, haulers, disposal sites, and service history — planned, not yet built."
          align="center"
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <RoadmapCard
            icon={Share2}
            title="ProofGraph"
            description="ProofGraph will visualize how customers, haulers, technicians, and disposal facilities connect across every proof packet — surfacing patterns that are invisible in a spreadsheet or filing cabinet."
            bullets={[
              "Visual map of records across your business network",
              "Surface repeat gaps by hauler or location",
              "Builds on existing proof packet and audit data",
              "No predictive or compliance-guarantee claims",
            ]}
          />
        </div>
      </section>
      <CTASection title="Curious how ProofGraph could help your team?" description="Tell us about your current record volume and we'll keep you posted as this rolls out." />
    </Layout>
  );
}
