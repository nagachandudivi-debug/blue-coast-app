import { HeroSection } from '../components/HeroSection'
import { MenuCategoriesSection } from '../components/MenuCategoriesSection'
import { PromoBanner } from '../components/PromoBanner'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoBanner variant="featured" />
      <MenuCategoriesSection />
    </>
  )
}
