import SEO from "../SEO";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar"
import { About } from "./subComponents/About";
import { Contact } from "./subComponents/Contact";
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
            <SEO
                title={`${import.meta.env.VITE_SITE_NAME}`}
                description="Secure Share is a fast and secure file sharing platform that lets you upload, store, and share images, documents, PDFs, text files, videos, audio, ZIP archives, and more. Enjoy secure cloud storage, instant file sharing, and easy access from anywhere."
                keywords="Secure Share, file sharing, secure file upload, cloud storage, share files online, upload images, upload PDF, upload videos, upload audio, upload documents, text file sharing, ZIP file upload, online file storage, encrypted file sharing, free file sharing, secure cloud storage, file transfer, document sharing"
                canonical={`${import.meta.env.VITE_WEB_URL}`}
            />

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
            <Contact />
            <About />
            <Footer />
        </>
    )
}