import React, { useEffect } from 'react';

export const Security = () => {

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

    const securityList = [
        {
            title: "Protected Authentication",
            Description: "Advanced authentication to keep your account safe from unauthorized access.",
            icon: "ri-shield-keyhole-line",
            aosDelay: "0",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiPyasad4vgF6F002tk71BvPycSpt4aTTRpXf0hhWCaLqZU5IY5PayRN0&s=10",
        },
        {
            title: "OTP Verification",
            Description: "Secure login and actions with one-time password verification.",
            icon: "ri-smartphone-line",
            aosDelay: "100",
            img: "https://growinghacker.com/wp-content/uploads/2023/04/OTP-768x512.jpeg",
        },
        {
            title: "Password Protected Downloads",
            Description: "Restrict file downloads with password-based access protection.",
            icon: "ri-lock-password-line",
            aosDelay: "200",
            img: "https://download-monitor.com/wp-content/uploads/2022/11/password-protected-files-1024x555.jpg",
        },
        {
            title: "Secure File Sharing Links",
            Description: "Share files securely using encrypted and protected access links.",
            icon: "ri-links-line",
            aosDelay: "300",
            img: "https://bettercloud.b-cdn.net/wp-content/uploads/2025/04/the-perils-of-exposed-files_800x400.png",
        },
        {
            title: "Link Expiration Controls",
            Description: "Automatically expire shared links after a set time for added security.",
            icon: "ri-time-line",
            aosDelay: "400",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPVUK7HUAt9KngOPqKpjL2E5g_NenERlWRo4dT113TJv6sArKTjRL5syY&s=10",
        },
    ];

    return (
        <>

            <section
                id="security"
                className="py-16 px-[5%] md:px-[10%] bg-[#FAFCFF]"
            >

                <div className="mx-auto">

                    <div className="text-center mb-9">

                        <h1 className="text-4xl md:text-5xl font-semibold text-zinc-900 mt-6">
                            Security Comes First
                        </h1>

                        <p className="text-base text-zinc-600 max-w-[530px] mx-auto mt-3">
                            your files are protected with industry-standard security measures designed to keep data private and secure
                        </p>

                    </div>

                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {securityList.map((list, index) => (

                                <div
                                    key={index}
                                    data-aos="fade-up"
                                    data-aos-delay={list.aosDelay}
                                    data-aos-duration="700"
                                    data-aos-easing="ease-out-cubic"
                                    className="w-full bg-white rounded-xl hover:shadow-md transition-all duration-300 p-5 flex flex-col sm:flex-row gap-5 items-stretch"
                                >

                                    {list.img &&

                                        <img
                                            src={list.img}
                                            alt={list.title}
                                            className="w-full h-48 md:h-full md:w-[45%] object-cover rounded-2xl"
                                        />
                                    }

                                    <div className="flex flex-col justify-center flex-1">

                                        <div className="size-11 bg-zinc-900 rounded-lg flex items-center justify-center mb-4">
                                            <i className={`${list.icon} text-white`}></i>
                                        </div>

                                        <h3 className="text-base font-semibold text-zinc-900">
                                            {list.title}
                                        </h3>

                                        <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                                            {list.Description}
                                        </p>

                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}