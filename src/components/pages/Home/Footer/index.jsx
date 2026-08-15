import React from 'react';

export const Footer = () => {

    const currentYear = new Date().getFullYear();
    const siteName = import.meta.env.VITE_SITE_NAME || "...";

    const developerSocials = [
        // { name: "GitHub", icon: "ri-github-fill", link: "https://github.com/Sarfraj-Shaikh" },
        { name: "Instagram", icon: "ri-instagram-line", link: "https://instagram.com/workwithsarfraj" },
    ];

    const quickLinks = [
        { title: "Home", link: "/" },
        { title: "Why Choose Us", link: "#why-choose-us" },
        { title: "How It Works", link: "#how-it-works" },
        { title: "Features", link: "#features" },
        { title: "Security", link: "#security" },
        { title: "Testimonials", link: "#testimonials" },
        { title: "Pricing", link: "#pricing" },
        { title: "FAQs", link: "#faqs" },
        { title: "Contact Us", link: "#contact" },
        { title: "About Us", link: "#about" },
    ];

    const legalPages = [
        { title: "Privacy Policy", link: "#" },
        { title: "Terms & Conditions", link: "#" },
        { title: "Terms of Services", link: "#" },
        { title: "Disclaimer", link: "#" },
        { title: "Cookie Policy", link: "#" },
    ];

    const contactDetails = [
        {
            title: "contact@example.com",
            link: "mailto:contact@example.com",
            icon: "ri-mail-line"
        },
        {
            title: "+91 12345 67890",
            link: "tel:+911234567890",
            icon: "ri-phone-line"
        },
        {
            title: "Mumbai, Maharashtra, India",
            link: "https://maps.google.com",
            icon: "ri-map-pin-line"
        },
        {
            title: "Mon-Fri (10:00 AM - 04:00 PM)",
            link: "#",
            icon: "ri-time-line"
        },
    ];

    return (

        <footer
            id="footer"
            className="relative overflow-hidden w-full text-sm text-slate-500 bg-white pt-12 pb-6 border-t border-slate-100 px-[5%] md:px-[10%]"
        >

            {/* Main Footer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-10">

                {/* Brand & About Section */}
                <div className="flex flex-col space-y-4">

                    <a href="/" className="inline-block">
                        <img
                            src="/assets/upload.png"
                            alt={siteName}
                            className="h-12 w-auto object-contain"
                        />
                    </a>

                    <p className="text-sm leading-relaxed text-slate-500">
                        {`${siteName} is a fast and secure file sharing platform that lets you upload, store, and share files effortlessly.`}
                    </p>

                    {/* WhatsApp CTA Button */}

                    <div className="pt-2">

                        <a
                            href="https://wa.me/911234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition duration-200 shadow-sm w-fit"
                        >

                            <i className="ri-whatsapp-line text-lg"></i>
                            <span>Chat on WhatsApp</span>

                        </a>

                    </div>

                </div>

                {/* Quick Links */}
                <div className="flex flex-col">

                    <h2 className="font-semibold text-base mb-4 text-gray-800">
                        Quick Links
                    </h2>

                    <ul className="grid grid-cols-2 gap-2 text-sm">

                        {quickLinks.map((item, idx) => (

                            <li key={idx}>

                                <a
                                    className="hover:text-slate-900 transition flex items-center gap-1"
                                    href={item.link}
                                >
                                    {item.title}
                                </a>

                            </li>

                        ))}

                    </ul>

                </div>

                {/* Legal Pages */}
                <div className="flex flex-col">

                    <h2 className="font-semibold text-base mb-4 text-gray-800">
                        Legal Pages
                    </h2>

                    <ul className="space-y-2.5 text-sm">

                        {legalPages.map((item, idx) => (

                            <li key={idx}>

                                <a
                                    className="hover:text-slate-900 transition"
                                    href={item.link}
                                >
                                    {item.title}
                                </a>

                            </li>

                        ))}

                    </ul>

                </div>

                {/* Contact Information */}
                <div className="flex flex-col">

                    <h2 className="font-semibold text-base mb-4 text-gray-800">
                        Contact Details
                    </h2>

                    <ul className="space-y-3 text-sm">

                        {contactDetails.map((item, idx) => (

                            <li key={idx}>

                                <a
                                    className="hover:text-slate-900 transition flex items-start gap-2.5"
                                    href={item.link}
                                >
                                    <i className={`${item.icon} text-slate-700 text-base leading-none mt-0.5`}></i>
                                    <span>{item.title}</span>
                                </a>

                            </li>

                        ))}

                    </ul>

                </div>

            </div>

            {/* Bottom Bar: Copyright & Legal Nav */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-slate-200 text-xs sm:text-sm">

                {/* Copyright with Verified Badge */}
                <p className="flex items-center gap-1.5 text-slate-600 text-center md:text-left flex-wrap justify-center">

                    <span className="font-medium">© {currentYear} {siteName}</span>
                    <i className="ri-verified-badge-fill text-blue-500 text-base" title="Verified"></i>
                    <span>All Rights Reserved.</span>

                </p>

                {/* Developer Credit & Social Links */}
                <div className="flex flex-col sm:flex-row items-center gap-4">

                    {/* Developer Credit */}
                    <div className="flex items-center gap-1 text-slate-600">

                        <span>Designed & Developed by</span>

                        <a
                            href="https://www.instagram.com/workwithsarfraj" // Replace with Developer Link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-slate-800 hover:underline"
                        >
                            {import.meta.env.VITE_DEV_NAME}
                        </a>

                        <i className="ri-heart-fill text-red-500 mx-0.5 animate-pulse"></i>
                        <span>in India</span>

                    </div>

                    {/* Social Media Icons */}
                    <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">

                        {developerSocials.map((social, idx) => (

                            <a
                                key={idx}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-slate-900 transition text-lg"
                                aria-label={social.name}
                            >
                                <i className={social.icon}></i>
                            </a>

                        ))}

                    </div>

                </div>

            </div>

        </footer>
    );
};