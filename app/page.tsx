import { Header } from "@/components/landing-page/header";
import { HeroSection } from "@/components/landing-page/hero";
import { AboutSection } from "@/components/landing-page/about";
import MissionSection from "@/components/landing-page/our-mission";
import {
  FirstSeparator,
  SecondSeparator,
} from "@/components/landing-page/text-separator";
import { PlatformSection } from "@/components/landing-page/our-platform";
import { OurTeam } from "@/components/landing-page/our-team";
import { Footer } from "@/components/landing-page/footer";
import { Socials } from "@/components/landing-page/socials";
import { ContactSection } from "@/components/landing-page/contact";

const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutSection />
      <OurTeam />
      <FirstSeparator />
      <MissionSection />
      <SecondSeparator />
      <PlatformSection />
      <ContactSection />
      <Socials />
      <Footer />
    </div>
  );
};

export default Home;
