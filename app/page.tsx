import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import { HeroSection } from "@/components/landing-page/hero";
import { MissionSection } from "@/components/landing-page/our-mission";
import { PlatformSection } from "@/components/landing-page/our-platform";
import { OurTeam } from "@/components/landing-page/our-team";
import { Socials } from "@/components/landing-page/socials";
import { AboutSection } from "@/components/landing-page/about";
import { TextSeparator } from "@/components/landing-page/text-separator";
import { FAQSection } from "@/components/landing-page/faq";

const Home = () => {
    return ( 
        <div className="">
            <Header />
            <HeroSection />
            <TextSeparator />
            <AboutSection />
            <MissionSection />
            <OurTeam />
            <PlatformSection />
            <FAQSection />
            <Socials />
            <Footer />
        </div>
     );
}
 
export default Home;