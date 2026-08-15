import React, { useEffect } from 'react';

export const About = () => {

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

    return (
        <>
            <section
                id="about"
                className="w-full flex-col items-center mx-auto py-20 px-[5%] md:px-[10%]"
            >

                <div className="flex w-full flex-col ">

                    <div
                        data-aos="fade-up"
                        data-aos-delay="0"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className="w-fit rounded-full text-center border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-slate-800"
                    >
                        About Us
                    </div>

                    <h1
                        data-aos="fade-up"
                        data-aos-delay="50"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className="mt-7 text-left text-4xl md:text-5xl font-semibold text-slate-900"
                    >
                        {`Who & What is ${import.meta.env.VITE_SITE_NAME}?`}
                    </h1>

                    <p
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className="mt-5 text-left text-sm md:text-base text-slate-600"
                    >
                        {import.meta.env.VITE_SITE_NAME} is a fast and secure file sharing platform that lets you upload, store, and share images, documents, PDFs, text files, videos, audio, ZIP archives, and more. Enjoy secure cloud storage, instant file sharing, and easy access from anywhere.
                    </p>

                </div>
                
            </section>
        </>
    )
}