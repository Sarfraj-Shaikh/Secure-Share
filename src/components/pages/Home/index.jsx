import { lazy, Suspense } from "react";
import SEO from "../SEO";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ShimmerLoading } from "../../shared/LoadingShimmer";

const Hero = lazy(() => import("./subComponents/Hero"));
const Statics = lazy(() => import("./subComponents/Statics"));
const WhyChooseUs = lazy(() => import("./subComponents/WhyChooseUs"));
const HowItsWorks = lazy(() => import("./subComponents/HowItsWorks"));
const Features = lazy(() => import("./subComponents/Features"));
const Security = lazy(() => import("./subComponents/Security"));
const Testimonials = lazy(() => import("./subComponents/Testimonials"));
const Pricing = lazy(() => import("./subComponents/Pricing"));
const Faqs = lazy(() => import("./subComponents/Faqs"));
const CtaSection = lazy(() => import("./subComponents/CtaSection"));
const Contact = lazy(() => import("./subComponents/Contact"));
const About = lazy(() => import("./subComponents/About"));

export const Home = () => {

    return (
        <>
            <SEO
                title={`${import.meta.env.VITE_SITE_NAME}`}
                description="Secure Share is a fast and secure file sharing platform that lets you upload, store, and share images, documents, PDFs, text files, videos, audio, ZIP archives, and more."
                keywords="Secure Share, file sharing, secure file upload, cloud storage"
                canonical={`${import.meta.env.VITE_WEB_URL}`}
            />

            <Navbar />

            <Suspense fallback={<ShimmerLoading />}>
                <Hero />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <Statics />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <WhyChooseUs />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <HowItsWorks />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <Features />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <Security />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <Testimonials />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <Pricing />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <Faqs />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <CtaSection />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <Contact />
            </Suspense>

            <Suspense fallback={<ShimmerLoading />}>
                <About />
            </Suspense>

            <Footer />
        </>
    );
};


