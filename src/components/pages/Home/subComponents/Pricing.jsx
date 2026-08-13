import React, { useEffect } from 'react';

export const Pricing = () => {

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

    const pricingData = [
        {
            name: "Free",
            aosDelay: "0",
            price: 0,
            description: "A simple and secure way to get started with basic features.",
            buttonText: "Get Started Free",
            features: [
                "30MB Free Storage to Get Started",
                "Secure File Uploads & Sharing",
                "Password Protected Downloads",
                "Secure Sharing Links",
                "2 Folders & 5 Shares Limit",
                "10 Credits",
            ],
            highlighted: false
        },
        {
            name: "Premium",
            aosDelay: "100",
            // price: 299,
            // discount: "20%", 
            badge: "MOST POPULAR",
            description: "Upgrade seamlessly as your storage and usage needs grow.",
            buttonText: "Start with Premium",
            features: [
                "Upgrade Storage Capacity as Needed",
                "Purchase Additional Credits as Needed",
                "Increase Folder Limits",
                "Increase Sharing Limits",
                "Priority Support",
                "Pay Only for What You Need",
            ],
            highlighted: true
        },
    ];

    return (

        <section
            id="pricing"
            className="bg-gradient-to-b from-slate-50 via-slate-100/50 to-white py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">

                    <span className="inline-block text-xs sm:text-sm font-semibold tracking-wider text-indigo-600 uppercase mb-3 bg-indigo-50 px-3 py-1 rounded-full">
                        Flexible Plans
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Start free. <br className="hidden sm:inline" />
                        Upgrade when you're ready
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-slate-600">
                        Choose the right plan for your workflow with transparent features and zero hidden fees.
                    </p>

                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">

                    {pricingData.map((plan, index) => (

                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={plan.aosDelay}
                            data-aos-duration="700"
                            data-aos-easing="ease-out-cubic"
                            className={`relative flex flex-col justify-between rounded-3xl transition-all duration-300 hover:-translate-y-1 ${plan.highlighted
                                ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-indigo-500/50'
                                : 'bg-white text-slate-900 border border-slate-200 shadow-xl hover:shadow-2xl'
                                }`}
                        >
                            {/* Popular Badge */}

                            {plan.badge && (

                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">

                                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                                        {plan.badge}
                                    </span>

                                </div>
                            )}

                            <div className="p-6 sm:p-8 flex-1 flex flex-col">

                                {/* Header */}
                                <div className="mb-6">

                                    <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                                        {plan.name}
                                    </h3>

                                    {/* Price display (renders conditionally) */}
                                    {plan.price !== undefined && (

                                        <div className="flex items-baseline gap-2 my-3">

                                            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                                ₹{plan.price}
                                            </span>

                                            <span className={`text-sm ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                                                / month
                                            </span>

                                            {plan.discount && (

                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                                                    SAVE {plan.discount}
                                                </span>

                                            )}

                                        </div>
                                    )}

                                    <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {plan.description}
                                    </p>

                                </div>

                                {/* Features List */}
                                <div className="my-6 flex-1 border-t border-slate-200/20 pt-6">

                                    <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${plan.highlighted ? 'text-slate-400' : 'text-slate-400'
                                        }`}>
                                        What's included
                                    </p>

                                    <ul className="space-y-3.5">

                                        {plan.features.map((feature, featureIndex) => (

                                            <li key={featureIndex} className="flex items-start gap-3 text-sm">

                                                <div className={`mt-0.5 rounded-full p-1 flex-shrink-0 ${plan.highlighted ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-100 text-emerald-600'
                                                    }`}>

                                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>

                                                </div>

                                                <span className={plan.highlighted ? 'text-slate-200' : 'text-slate-700'}>
                                                    {feature}
                                                </span>

                                            </li>

                                        ))}

                                    </ul>

                                </div>

                                {/* Action Button */}
                                <div className="mt-auto pt-4">

                                    <button
                                        className={`w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer active:scale-[0.98] ${plan.highlighted
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/25 shadow-lg'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </section>
    );
};