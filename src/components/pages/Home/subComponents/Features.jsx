import React, { useEffect } from 'react';

export const Features = () => {

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

    const features = [
        {
            title: "Files Uploads",
            description: "Upload documents, images, videos, audios, zip, pdf and software files",
            icon: "ri-upload-line",
            aosDelay: "0",
        },
        {
            title: "Files Management",
            description: "Search, filter and organise uploaded files",
            icon: "ri-file-line",
            aosDelay: "150",
        },
        {
            title: "Secure Downloads",
            description: "Paasword-protected and expiration based downloads",
            icon: "ri-file-lock-line",
            aosDelay: "250",
        },
        {
            title: "Track History",
            description: "Track all shared files and downloaded activities",
            icon: "ri-history-line",
            aosDelay: "350",
        },
        {
            title: "Premium Plan",
            description: "Manage storage, folders, and sharing files credits based on your usages",
            icon: "ri-vip-crown-line",
            aosDelay: "450",
        },
    ]

    return (
        <>

            <div
                id="features"
                className="w-full py-10 px-6 flex flex-col items-center"
            >

                <div className="text-center mx-auto">

                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-50 text-base text-slate-800">
                        Our Features
                    </span>

                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mt-6">
                        We Offer Best Facilities
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 mt-3 max-w-[530px] mx-auto">
                        Everything you need to manage your files
                    </p>

                </div>

                {/* Features Grid */}
                <div
                    className="w-full mx-auto mt-10 relative grid grid-cols-1 md:grid-cols-3 border-x border-slate-100 md:divide-x divide-y md:divide-y-0 divide-slate-100 px-[5%] md:px-[10%] gap-3"
                >

                    {
                        features.map((item, index) => (

                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={item.aosDelay}
                                data-aos-duration="700"
                                data-aos-easing="ease-out-cubic"
                                className="flex flex-col items-start px-6 py-8 hover:bg-slate-50 transition-colors"
                            >

                                <div
                                    className="size-13 flex items-center justify-center border border-slate-200 rounded-lg mb-11"
                                >
                                    <i className={item.icon}></i>
                                </div>

                                <h3 className="text-base font-medium text-slate-800">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-slate-600 mt-2.5">
                                    {item.description}
                                </p>

                                {/* <a
                                    href="#"
                                    className="mt-8 flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-800 transition-colors group"
                                >
                                    Explore Feature
                                </a> */}
                            </div>
                        ))
                    }
                </div>
            </div>

        </>
    )
}