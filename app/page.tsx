import { Header } from "@/components/landing-page/header";
import { HeroSection } from "@/components/landing-page/hero";
import { AboutSection } from "@/components/landing-page/about";
import MissionSection from "@/components/landing-page/our-mission";
import { FirstSeparator, SecondSeparator } from "@/components/landing-page/text-separator";
import { Footer } from "@/components/landing-page/footer";
const Home = () => {
    return (
        <div>
            <Header />
            <HeroSection />
            <AboutSection />
            <FirstSeparator />
            <MissionSection />
            <SecondSeparator />
            <Footer />
        </div>
    );
};

export default Home;
