import { MarketingLayout } from "@/layouts/marketing-layout";
import { Hero } from "@/features/landing/hero";
import { QuickActions } from "@/features/landing/quick-actions";
import { FeatureGrid } from "@/features/landing/feature-grid";
import { ArchitectureSection } from "@/features/landing/architecture-section";
import { UseCaseSection } from "@/features/landing/use-case-section";

export default function LandingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <QuickActions />
      <FeatureGrid />
      <ArchitectureSection />
      <UseCaseSection />
    </MarketingLayout>
  );
}
