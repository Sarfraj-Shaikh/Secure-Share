import React, { useEffect, useState } from 'react';

export const Faqs = () => {

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

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    }

    const faqs = [
        {
            question: "What is this platform used for?",
            answer: "Our platform provides a simple and secure way to upload, store, and share your files. You can easily share files with others while keeping them protected.",
            aosDelay: "0",
        },
        {
            question: "Is there a free plan available?",
            answer: "Yes! You can get started with our Free plan at no cost. It includes essential features for secure file uploading and sharing, with the option to upgrade whenever you need more.",
            aosDelay: "100",
        },
        {
            question: "How secure are my files?",
            answer: "We take your privacy and security seriously. Your files are protected using secure authentication, password-protected downloads, and secure sharing links.",
            aosDelay: "200",
        },
        {
            question: "Can I protect my shared files with a password?",
            answer: "Yes. You can add password protection to downloads so that only authorized people can access your shared files.",
            aosDelay: "300",
        },
        {
            question: "Do shared links expire?",
            answer: "Yes. Link expiration controls allow you to set how long a shared link remains accessible, giving you greater control over your files.",
            aosDelay: "400",
        },
        {
            question: "Do I need to create an account to use the platform?",
            answer: "Some features may be available without an account, while creating an account gives you access to additional features such as managing your files, folders, and shared links.",
            aosDelay: "500",
        },
        {
            question: "Can I upgrade my plan later?",
            answer: "Absolutely! You can upgrade your plan whenever your storage or usage requirements increase. Simply choose the option that best fits your needs.",
            aosDelay: "600",
        },
        {
            question: "Do you provide customer support?",
            answer: "Yes. We are happy to help whenever you need assistance. Premium users can also receive priority support for their requests.",
            aosDelay: "700",
        },
    ];

    return (
        <>
            <section className='w-full flex flex-col items-center justify-center py-20 px-[5%] md:px-[10%]'>

                <div className='w-full'>

                    <div className='mb-10'>

                        <h2 className='text-4xl md:text-5xl font-semibold text-neutral-900 text-center md:text-start mb-4'>
                            Most asked FAQ's
                        </h2>

                        <p className='text-neutral-800 text-sm text-center md:text-start mx-auto md:mx-0'>
                            We're here to help you and solve doubts. Find answers to the most common questions below.
                        </p>

                    </div>

                    <div
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'
                    >

                        {faqs.map((faq, index) => (

                            <div
                                key={index}
                                onClick={() => toggleFAQ(index)}
                                className={`bg-slate-50 p-3.5 rounded-lg cursor-pointer transition-all duration-300 border border-slate-200 hover:bg-slate-100 ${openIndex === index ? 'row-span-2' : ''}`}>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium text-neutral-800'>{faq.question}</span>
                                    <div className={`text-slate-400 p-1 rounded transition-colors ${openIndex === index ? 'bg-slate-200 text-slate-500' : 'hover:bg-slate-300 hover:text-slate-500'}`}>
                                        {openIndex === index ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><path d="M5 12h14" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                        )}
                                    </div>
                                </div>
                                <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className='overflow-hidden'>
                                        <p className='text-sm text-neutral-600 leading-relaxed'>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}