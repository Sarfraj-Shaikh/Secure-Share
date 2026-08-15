import React, { useEffect } from 'react';

export const CtaSection = () => {

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
            <div className="w-full px-[5%] md:px-[10%] pb-20 rounded-2xl">

                <div
                    className="max-md:text-center mx-2 md:mx-auto flex flex-col md:flex-row items-center justify-between text-left bg-gradient-to-b from-[#4C0083] to-[#180047] rounded-2xl text-white p-10 break-words"
                >

                    <div>

                        <h1
                            data-aos="fade-up"
                            data-aos-delay="0"
                            data-aos-duration="700"
                            data-aos-easing="ease-out-cubic"
                            className="text-4xl md:text-5xl md:leading-[60px] font-semibold bg-gradient-to-r from-white to-[#CAABFF] text-transparent bg-clip-text"
                        >
                            Start Sharing Files Securely Today
                        </h1>

                        <p
                            data-aos="fade-up"
                            data-aos-delay="100"
                            data-aos-duration="700"
                            data-aos-easing="ease-out-cubic"
                            className="bg-gradient-to-r from-white to-[#CAABFF] text-transparent bg-clip-text text-sm md:text-base mt-5"
                        >
                            Get started with your free account plan and experience secure files sharing with advanced protection features.
                        </p>

                    </div>

                    <button
                        onClick={() => { window.location.href = `${window.location}register` }}
                        data-aos="fade-left"
                        data-aos-delay="50"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className="px-12 py-3 text-slate-800 bg-white rounded-full text-sm mt-4 cursor-pointer hover:bg-[#e9e9e9]"
                    >
                        Get Started
                    </button>

                </div>
                
            </div>
        </>
    );
};