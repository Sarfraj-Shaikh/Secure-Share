import { Navbar } from "./Navbar"
import { Features } from "./subComponents/Features";
import { Hero } from "./subComponents/Hero"
import { HowItsWorks } from "./subComponents/HowItsWorks";
import { Security } from "./subComponents/Security";
import { Statics } from './subComponents/Statics'; // ✅ Correct
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
        </>
    )
}