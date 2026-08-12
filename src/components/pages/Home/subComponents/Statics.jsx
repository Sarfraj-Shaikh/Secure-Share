import React, { useEffect } from 'react';
import SlotCounter from 'react-slot-counter';

export const Statics = () => {

    useEffect(() => {
        // 1. Check & Auto-Inject AOS CSS CDN if missing
        if (!document.getElementById('aos-css')) {
            const link = document.createElement('link');
            link.id = 'aos-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
            document.head.appendChild(link);
        }

        // 2. Initialize AOS with a slight delay to ensure DOM is ready
        const initAOS = () => {
            if (window.AOS) {
                window.AOS.init({
                    duration: 800,
                    easing: 'ease-out-cubic',
                    once: false, // Scroll up/down dono par trigger karne ke liye
                    mirror: true,
                    offset: 100,
                    disable: false // Ensure mobile devices par block na ho
                });
                window.AOS.refreshHard(); // Hard refresh to recalculate positions
            }
        };

        // Agar AOS JS load nahi hui hai toh dynamic load karke init karo
        if (!window.AOS && !document.getElementById('aos-js')) {
            const script = document.createElement('script');
            script.id = 'aos-js';
            script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
            script.onload = () => initAOS();
            document.body.appendChild(script);
        } else {
            // Short timeout so React completes component mounting
            const timer = setTimeout(() => {
                initAOS();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const statsData = [
        {
            id: 1,
            iconClass: 'ri-file-upload-line text-indigo-600',
            bgClass: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
            count: 1000,
            suffix: '+',
            label: 'Files Uploaded',
            aosDelay: '0'
        },
        {
            id: 2,
            iconClass: 'ri-share-forward-line text-emerald-600',
            bgClass: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
            count: 500,
            suffix: '+',
            label: 'Files Shared',
            aosDelay: '150'
        },
        {
            id: 3,
            iconClass: 'ri-shield-check-line text-amber-600',
            bgClass: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
            count: 99,
            suffix: '%',
            label: 'Secure Downloads',
            aosDelay: '300'
        },
        {
            id: 4,
            iconClass: 'ri-time-line text-purple-600',
            bgClass: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
            count: 24,
            suffix: '/7*',
            label: 'Access From Anywhere',
            aosDelay: '450'
        },
    ];

    return (
        <section className="relative py-10 sm:px-6 mx-auto overflow-hidden px-[5%] md:px-[10%]">

            {/* Seamless Fluid Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {statsData.map((item) => (
                    <div
                        key={item.id}
                        data-aos="fade-up"
                        data-aos-delay={item.aosDelay}
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className="group relative bg-slate-50 border border-slate-200/80 rounded-2xl p-6 transition-[transform,background-color,box-shadow,border-color] duration-300 ease-out will-change-transform hover:bg-white hover:shadow-xl hover:border-slate-300 hover:-translate-y-1"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            {/* Icon Wrapper */}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.bgClass}`}>
                                <i className={`${item.iconClass} text-2xl`}></i>
                            </div>

                            {/* Value & Label */}
                            <div className="flex flex-col text-center sm:text-left">
                                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start">
                                    <SlotCounter value={item.count} />
                                    <span className="text-indigo-600 ml-0.5">{item.suffix}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                                    {item.label}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
};

export default Statics;