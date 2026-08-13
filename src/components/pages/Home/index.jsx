import { Navbar } from "./Navbar"
import { CtaSection } from "./subComponents/CtaSection";
import { Faqs } from "./subComponents/Faqs";
import { Features } from "./subComponents/Features";
import { Hero } from "./subComponents/Hero"
import { HowItsWorks } from "./subComponents/HowItsWorks";
import { Pricing } from "./subComponents/Pricing";
import { Security } from "./subComponents/Security";
import { Statics } from './subComponents/Statics'; // ✅ Correct
import { Testimonials } from "./subComponents/Testimonials";
import { WhyChooseUs } from "./subComponents/WhyChooseUs";

export const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Statics />
            <WhyChooseUs />
            <HowItsWorks />
            <Features />
            <Security />
            <Testimonials />
            <Pricing />
            <Faqs />
            <CtaSection />
        </>
    )
}