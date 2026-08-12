import React, { useState, useEffect, useRef } from "react";

export const Navbar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Close Dropdown On Click Outside
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleKeyDown = (event) => {

            if (event.key === "Escape") {
                setIsDropdownOpen(false);
                setIsMobileMenuOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {

            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);

        };

    }, []);

    // Prevent Body Scroll When Mobile Menu Is Open
    useEffect(() => {

        if (isMobileMenuOpen) {

            document.body.style.overflow = "hidden";

        } else {

            document.body.style.overflow = "unset";

        }

    }, [isMobileMenuOpen]);

    // All Features Items For Desktop Dropdown & Direct Mobile List
    const featureItems = [
        { href: "#features", icon: "ri-flashlight-line", label: "Features" },
        { href: "#why-choose-us", icon: "ri-star-smile-line", label: "Why Choose Us" },
        { href: "#contact", icon: "ri-customer-service-2-line", label: "Contact Us" },
        { href: "#about", icon: "ri-information-line", label: "About Us" },
        { href: "#faqs", icon: "ri-question-line", label: "FAQs" },
    ];

    // Other Nav Links
    const otherNavLinks = [
        { href: "#how-it-works", icon: "ri-play-circle-line", label: "How it works" },
        { href: "#pricing", icon: "ri-price-tag-3-line", label: "Pricing" },
    ];

    return (

        <>
            {/* TOP NAVIGATION BAR */}
            <div
                className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-gray-200 bg-white/95 px-[5%] py-2 backdrop-blur-md md:px-[10%]"
            >

                {/* LOGO */}
                <a href="/" className="group flex cursor-pointer items-center gap-2">

                    <img
                        src="/assets/upload.png"
                        alt={import.meta.env.VITE_SITE_NAME || "Logo"}
                        className="h-10 w-10 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <p
                        className="text-lg font-semibold text-black transition-colors duration-200 group-hover:text-blue-600"
                    >
                        {import.meta.env.VITE_SITE_NAME || "..."}
                    </p>

                </a>

                {/* DESKTOP MENU */}
                <ul className="hidden items-center gap-6 text-sm font-medium text-[#677283] md:flex">

                    {/* DESKTOP DROPDOWN (HOVER + CLICK) */}
                    <li
                        ref={dropdownRef}
                        className="group relative flex cursor-pointer items-center gap-1 py-2"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className="flex items-center gap-1 transition-colors duration-200 hover:text-black focus:outline-none"
                        >
                            <span>Features</span>
                            <i
                                className={`ri-arrow-down-s-line text-base transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-black" : ""
                                    }`}
                            ></i>
                        </button>

                        {/* Dropdown Menu */}
                        <div
                            className={`absolute left-0 top-full w-[320px] rounded-xl border border-gray-100 bg-white py-2 shadow-xl transition-all duration-200 ${isDropdownOpen
                                ? "visible opacity-100 translate-y-0"
                                : "invisible opacity-0 translate-y-2 pointer-events-none"
                                }`
                            }
                        >
                            {featureItems.map((item, index) => (

                                <a
                                    key={index}
                                    href={item.href}
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="group flex items-center gap-3 border-l-4 border-transparent px-4 py-2.5 text-gray-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <i className={`${item.icon} text-lg text-gray-400 transition-colors group-hover:text-blue-600`}></i>
                                    <span className="font-medium">{item.label}</span>
                                </a>
                            ))}

                        </div>

                    </li>

                    {otherNavLinks.map((link, idx) => (

                        <li key={idx}>

                            <a href={link.href} className="transition-colors duration-200 hover:text-black">
                                {link.label}
                            </a>

                        </li>

                    ))}

                </ul>

                {/* DESKTOP CTA & MOBILE HAMBURGER */}
                <div className="flex items-center gap-4 text-sm font-medium">

                    <a
                        href="#login"
                        className="hidden text-[#677283] transition-colors duration-200 hover:text-black sm:block"
                    >
                        Login
                    </a>

                    <a
                        href="#get-started"
                        className="rounded-lg bg-[#4052F6] px-4 py-2 text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#3345e8] hover:shadow-md active:translate-y-0"
                    >
                        Get Started
                    </a>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Mobile Menu"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-[#677283] transition-all duration-200 hover:bg-gray-100 hover:text-black active:scale-95 md:hidden"
                    >
                        <i className="ri-menu-3-line"></i>
                    </button>

                </div>

            </div>

            {/* MOBILE SIDEBAR BACKDROP */}
            <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
            />

            {/* MOBILE SIDEBAR DRAWER */}
            <aside
                className={`fixed top-0 right-0 z-50 flex h-full w-[290px] sm:w-[320px] flex-col justify-between bg-white p-6  transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >

                {/* TOP SECTION: Header & Direct Navigation Items */}
                <div className="flex flex-col gap-5 overflow-y-auto pr-1">

                    {/* Header: Logo & Close Button */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">

                        <a
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2"
                        >

                            <img
                                src="/assets/upload.png"
                                alt={import.meta.env.VITE_SITE_NAME || "Logo"}
                                className="h-9 w-9 rounded-lg object-cover"
                            />

                            <span className="text-base font-semibold text-black">
                                {import.meta.env.VITE_SITE_NAME || "Website"}
                            </span>

                        </a>

                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close Mobile Menu"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-500 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 hover:text-black active:scale-95"
                        >
                            <i className="ri-close-line"></i>
                        </button>

                    </div>

                    {/* Direct Menu List with Smooth Hover Effects */}
                    <nav className="flex flex-col gap-1.5 font-medium text-gray-700">

                        {/* All Direct Links */}
                        {[...featureItems, ...otherNavLinks].map((item, index) => (

                            <a
                                key={index}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 hover:translate-x-1 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98]"
                            >

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">

                                    <i className={`${item.icon} text-base`}></i>

                                </div>

                                <span className="font-medium">{item.label}</span>
                            </a>

                        ))}
                    </nav>

                </div>

                {/* BOTTOM SECTION: CTA Buttons */}
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">

                    <a
                        href="#login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full rounded-xl border border-gray-200 py-2.5 text-center font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-black active:scale-[0.98]"
                    >
                        Login
                    </a>

                    <a
                        href="#get-started"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full rounded-xl bg-[#4052F6] py-2.5 text-center font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3345e8] hover:shadow-md active:translate-y-0"
                    >
                        Get Started
                    </a>

                </div>

            </aside>
            
        </>
        
    );
};