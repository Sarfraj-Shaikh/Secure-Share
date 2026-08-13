import React, { useEffect } from 'react';

export const WhyChooseUs = () => {

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
            title: 'Secure Sharing',
            description: 'Share files securely through unique download links.',
            action: '',
            icon: "ri-file-lock-line",
            aosDelay: '0',
        },
        {
            title: 'Password Protection',
            description: 'Protect downloads with custom passwords.',
            action: '',
            icon: "ri-lock-line",
            aosDelay: '150',
        },
        {
            title: 'Expiry Controls',
            description: 'Set expiration dates and control file access.',
            action: '',
            icon: "ri-calendar-line",
            aosDelay: '250',
        },
        {
            title: 'Fast Upload',
            description: 'Upload files quickly and manage them easily.',
            action: '',
            icon: "ri-upload-line",
            aosDelay: '350',
        },
        {
            title: 'Activity Tracking',
            description: 'Track all uploaded and shared files from one dashboard.',
            action: '',
            icon: "ri-dashboard-3-line",
            aosDelay: '450',
        },
        {
            title: 'Email Notification',
            description: 'Automatically send branded emails when you share files.',
            action: '',
            icon: "ri-notification-line",
            aosDelay: '550',
        },

    ];

    return (
        <>
            <section 
            id='why-choose-us'
            className="w-full flex-col items-center mx-auto px-[5%] md:px-[10%] py-10"
            >

                <div className="mx-auto flex w-full flex-col items-center">

                    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-slate-800">
                        Core Features
                    </div>

                    <h1 className="mt-7 text-center text-4xl md:text-5xl font-semibold text-slate-900">
                        {`Why Choose ${import.meta.env.VITE_SITE_NAME}?`}
                    </h1>

                    <p className="mt-3 max-w-[600px] text-center text-sm md:text-base text-slate-600">
                        A simple and secure file-sharing platform designed to upload, manage, access, and share files without compromising privacy.
                    </p>

                    <div
                        className="mt-10 grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5"
                    >

                        {features.map((feature, idx) => (

                            <div
                                key={idx}
                                data-aos="fade-up"
                                data-aos-delay={feature.aosDelay}
                                data-aos-duration="700"
                                data-aos-easing="ease-out-cubic"
                                className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-6 hover:bg-slate-100 transition-colors duration-300"
                            >

                                <i className={`${feature.icon} flex size-10 items-center justify-center rounded-lg border border-slate-200`}></i>

                                <h2 className="mt-6 text-sm font-medium text-slate-800">
                                    {feature.title}
                                </h2>

                                <p className="mt-2 grow text-sm leading-5 text-slate-600">
                                    {feature.description}
                                </p>

                                {/* <div
                                    className="my-4.5 h-px w-full bg-linear-to-r from-slate-100 via-slate-200 to-slate-100"
                                /> */}

                                {/* <a
                                    href="#"
                                    className="flex items-center gap-1 text-sm text-slate-600 group"
                                >
                                    {feature.action}

                                    <svg
                                        className='transition-transform duration-300 group-hover:translate-x-1'
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3.333 8h9.334M8 3.336l4.667 4.667L8 12.669"
                                            stroke="#45556c"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />

                                    </svg>

                                </a> */}

                            </div>
                        ))}

                    </div>

                </div>

            </section>
        </>
    )
}