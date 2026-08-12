import { useState } from "react";

export const Hero = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <header
                className="flex flex-col items-center justify-center relative pt-10  overflow-hidden min-h-screen px-4 px-[5%] md:px-[10%]"
            >

                {/* Top Badge */}
                <div
                    className="mt-16 sm:mt-24 md:mt-28 inline-flex max-w-full flex-wrap items-center justify-center gap-2.5 rounded-full border border-blue-200/80 bg-white/80 backdrop-blur-md px-4 py-2 shadow-xs transition-transform duration-300 cursor-pointer animate-fade-in"
                >

                    <div className="relative flex h-3.5 w-3.5 items-center justify-center flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                    </div>

                    <p className="text-center text-xs sm:text-sm font-medium text-blue-600 tracking-wide">
                        Secure File Sharing &amp; Uploading Platform
                    </p>

                </div>

                {/* Heading with Customized Colors */}
                <h1
                    className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-extrabold max-w-[850px] mt-6 leading-[1.15] tracking-tight transition-all duration-500 pt-5"
                >

                    <span className="text-zinc-900">Upload, Protect</span>{" "}
                    <span className="bg-blue-600 bg-clip-text text-transparent">
                        and Share Files Securely with Anyone
                    </span>

                </h1>

                {/* Subtitle */}
                <p
                    className="text-sm sm:text-base md:text-lg text-center max-w-[620px] mt-4 text-zinc-600 font-normal leading-relaxed pt-5"
                >
                    Store your files securely, protect downloads with password, set expiration, and share files instantly with anyone through email or link.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mt-8 w-full sm:w-auto pt-5">

                    {/* Primary Button */}
                    <button
                        className="w-full sm:w-[180px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg text-sm shadow-md hover:shadow-blue-500/25 transition-all duration-300 ease-out transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                        Get Started
                    </button>

                    {/* Secondary Button */}
                    <button
                        className="w-full sm:w-[180px] border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-800 font-medium px-6 py-3 rounded-lg text-sm transition-all duration-300 ease-out transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-2xs"
                    >
                        View Pricing
                    </button>

                </div>

                {/* Hero Image Container */}
                <div
                    className="w-full max-w-[1100px] mt-12 sm:mt-16 mb-16 sm:mb-14 transition-all duration-700 ease-out transform"
                >

                    <div
                        className="p-2 sm:p-3 bg-white/60 rounded-2xl border border-zinc-200/80  backdrop-blur-xs"
                    >

                        <img
                            className="max-h-[400px] sm:max-h-[420px] md:max-h-[520px] object-cover object-top w-full rounded-xl border border-zinc-200/60"
                            src="https://assets.prebuiltui.com/components/hero-section/hero-modern-dashboard.png"
                            alt="Dashboard Preview"
                        />

                    </div>

                </div>

            </header>
        </>
    );
};