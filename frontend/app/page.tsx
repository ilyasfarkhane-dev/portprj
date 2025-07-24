import { HeroCarousel } from "@/components/hero-carousel"
import { PortStory } from "@/components/port-story"
import { InfrastructureMap } from "@/components/infrastructure-map"
import { ServicesSection } from "@/components/services-section"
import { StatsSection } from "@/components/stats-section"
import { NewsMediaSection } from "@/components/news-media-section"
import { DecorativeBorder } from "@/components/decorative-border"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex-1 pt-16">
      <HeroCarousel />
      <DecorativeBorder />
      <PortStory />
      <DecorativeBorder />
      <InfrastructureMap />
      <DecorativeBorder />
      <ServicesSection />
      <DecorativeBorder />
      <StatsSection />
      <DecorativeBorder />
      <NewsMediaSection />
      <DecorativeBorder />

      <section id="cta" className="py-24">
        <div className="container">
          <div className="rounded-2xl bg-[#008A3C] p-8 md:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                  Prêt à collaborer avec nous?
                </h2>
                <p className="text-white/90 md:text-xl">
                  Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous aider.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row lg:justify-end">
                <Button size="lg" className="bg-white text-[#008A3C] hover:bg-white/90">
                  Nous Contacter
                </Button>
                <Button size="lg" variant="outline" className="text-[#008A3C] border-white hover:bg-white/10">
                  Télécharger la Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
