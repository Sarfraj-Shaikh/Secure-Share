import React, { useEffect } from 'react';

export const HowItsWorks = () => {

    useEffect(() => {

        // 1. Initialize AOS with a slight delay to ensure DOM is ready
        const initAOS = () => {
            if (window.AOS) {
                window.AOS.init({
                    duration: 800,
                    easing: 'ease-out-cubic',
                    once: false,
                    mirror: true,
                    offset: 100,
                    disable: false
                });
                window.AOS.refreshHard();
            }
        };

    }, []);

    const stepsList = [
        {
            title: "Upload Your Files",
            description: "Select and Upload files securely from your device",
            icon: "ri-upload-line",
            color: "violet",
            aosDelay: "0",
        },
        {
            title: "Add Protection",
            description: "Apply password protections and expiration settings",
            icon: "ri-lock-line",
            color: "emerald",
            aosDelay: "250",
        },
        {
            title: "Share Instantly",
            description: "Send secure download links via email",
            icon: "ri-share-line",
            color: "sky",
            aosDelay: "350",
        },
        {
            title: "Download Securely",
            description: "Recipients access files securely from anywhere",
            icon: "ri-download-line",
            color: "orange",
            aosDelay: "450",
        },
    ];

    const colorClasses = {
        violet: {
            border: "border-violet-200 hover:border-violet-500",
            bg: "bg-violet-100",
            icon: "text-violet-600",
            shadow: "hover:shadow-violet-200",
        },
        emerald: {
            border: "border-emerald-200 hover:border-emerald-500",
            bg: "bg-emerald-100",
            icon: "text-emerald-600",
            shadow: "hover:shadow-emerald-200",
        },
        sky: {
            border: "border-sky-200 hover:border-sky-500",
            bg: "bg-sky-100",
            icon: "text-sky-600",
            shadow: "hover:shadow-sky-200",
        },
        orange: {
            border: "border-orange-200 hover:border-orange-500",
            bg: "bg-orange-100",
            icon: "text-orange-600",
            shadow: "hover:shadow-orange-200",
        },
        pink: {
            border: "border-pink-200 hover:border-pink-500",
            bg: "bg-pink-100",
            icon: "text-pink-600",
            shadow: "hover:shadow-pink-200",
        },
        indigo: {
            border: "border-indigo-200 hover:border-indigo-500",
            bg: "bg-indigo-100",
            icon: "text-indigo-600",
            shadow: "hover:shadow-indigo-200",
        },
    };

    return (
        <>

            <div 
            id='how-it-works'
            className="mx-auto flex w-full flex-col items-center py-10 px-10"
            >

                <h1 className="text-4xl md:text-5xl font-semibold text-center mx-auto pt-10">
                    {`How ${import.meta.env.VITE_SITE_NAME} Works?`}
                </h1>

                <p className="text-sm md:text-base text-slate-600 text-center mt-2 max-w-[600px] mx-auto">
                    We've outlined the simplest and easiest way to use our platform. Understand how it works and make the most of its features.
                </p>

            </div>

            <div
                className="flex items-center justify-center flex-wrap gap-6 mt-10 px-[5%] md:px-[10%] pb-20"
            >

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

                    {stepsList.map((list, index) => {

                        const color = colorClasses[list.color] || colorClasses.violet;

                        return (

                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={list.aosDelay}
                                data-aos-duration="700"
                                data-aos-easing="ease-out-cubic"
                            >
                                <div
                                    className={`group h-[250px] flex flex-col items-center justify-center text-center p-6 rounded-2xl border ${color.border} bg-white transition-[box-shadow,border-color] duration-300 will-change-transform hover:shadow-sm ${color.shadow}`}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`w-20 h-20 flex items-center justify-center rounded-full ${color.bg} transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-12`}
                                    >

                                        <i
                                            className={`${list.icon} text-4xl ${color.icon} transition-transform duration-300 ease-out group-hover:scale-125`}
                                        />

                                    </div>

                                    <div className="mt-6">

                                        <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                            {`${index + 1}. ${list.title}`}
                                        </h3>

                                        <p className="text-sm leading-6 text-slate-600">
                                            {list.description}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>
            </div>

        </>
    );
};