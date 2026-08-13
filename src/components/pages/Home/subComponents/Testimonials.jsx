import React, { useEffect } from 'react';

export const Testimonials = () => {

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

    const reviewList = [
        {
            name: "Shaikh Mo Sarfraj",
            username: "workwithsarfraj",
            link: "https://www.instagram.com/workwithsarfraj",
            profileImg: "https://avatars.githubusercontent.com/u/137554535?v=4",
            icon: "ri-instagram-line",
            review: "Mujhe kaafi achha laga ki yeh platform users ke liye genuinely helpful hai. Files ko safely aur securely upload & share karna itna easy hai ki ab ‘file kahan bheju?’ wali tension khatam 😄🔐",
            date: "2:30 PM · Jan 18, 2026",
            aosDelay: "0",
        },
        {
            name: "Aarav Sharma",
            username: "aaravsharma",
            link: "#",
            profileImg: "https://i.pravatar.cc/150?img=12",
            icon: "ri-twitter-x-line",
            review: "Simple, fast aur secure! 🚀 File share karne ke liye itne steps nahi karne padte ki chai thandi ho jaye 😂☕ Really smooth experience!",
            date: "11:45 AM · Feb 06, 2026",
            aosDelay: "100",
        },
        {
            name: "Riya Verma",
            username: "riyaverma",
            link: "#",
            profileImg: "https://i.pravatar.cc/150?img=47",
            icon: "ri-linkedin-line",
            review: "Security features kaafi impressive hain 🔐✨ Password protection aur secure links ne file sharing ko super easy aur tension-free bana diya. Loved it! ❤️",
            date: "4:20 PM · Mar 14, 2026",
            aosDelay: "200",
        },
        {
            name: "Aditya Mehta",
            username: "adityamehta",
            link: "#",
            profileImg: "https://i.pravatar.cc/150?img=33",
            icon: "ri-twitter-x-line",
            review: "Kaafi clean aur user-friendly platform hai 😎📁 Files securely share ho jati hain aur interface bhi itna simple hai ki tutorial dekhne ki zarurat hi nahi padi 😂",
            date: "9:10 AM · Apr 02, 2026",
            aosDelay: "300",
        },
        {
            name: "Neha Singh",
            username: "nehasingh",
            link: "#",
            profileImg: "https://i.pravatar.cc/150?img=44",
            icon: "ri-instagram-line",
            review: "Design clean hai, sharing super easy hai aur security bhi solid 🔒💫 Overall experience bahut achha raha. Ab files share karna ekdum ‘send it and chill’ wala scene hai 😄",
            date: "6:35 PM · May 21, 2026",
            aosDelay: "400",
        },
        {
            name: "Rahul Kapoor",
            username: "rahulkapoor",
            link: "#",
            profileImg: "https://i.pravatar.cc/150?img=68",
            icon: "ri-linkedin-line",
            review: "Fast, reliable aur secure — exactly jo ek file sharing platform se chahiye! ⚡🔐 Large files bhi easily share ho jati hain. Overall, no complaints, only uploads 😄📤",
            date: "1:25 PM · Jun 09, 2026",
            aosDelay: "500",
        },
    ];

    return (
        <>

            <div
                id="testimonials"
                className="w-full py-20 px-6 flex flex-col items-center"
            >

                <div className="text-center mx-auto">

                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-50 text-base text-slate-800">
                        Testimonials
                    </span>

                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mt-6">
                        What Our Customers Says?
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 mt-3 max-w-[530px] mx-auto">
                        Hear their experiences and see how we help protect their files every day.
                    </p>

                </div>

                {/* Features Grid */}
                <div
                    className="w-full mx-auto mt-10 relative grid grid-cols-1 md:grid-cols-3 border-slate-100 md:divide-x divide-y md:divide-y-0 divide-slate-100 px-[5%] md:px-[10%] gap-5"
                >

                    {
                        reviewList.map((item, index) => (

                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={item.aosDelay}
                                data-aos-duration="700"
                                data-aos-easing="ease-out-cubic"
                                className="max-w-lg w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >

                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">

                                    <div className="flex items-center space-x-3">

                                        <a
                                            href={item.link} target="_blank" rel="noopener noreferrer"
                                            className="flex-shrink-0"
                                        >

                                            <img
                                                src={item.profileImg}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                            />

                                        </a>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-center space-x-1">

                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 hover:underline truncate" >
                                                    {item.name}
                                                </a>

                                            </div>

                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:underline" >
                                                @{item.username}
                                            </a>

                                        </div>

                                    </div>

                                    <a
                                        href={item.link} target="_blank" rel="noopener noreferrer"
                                        className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
                                    >
                                        <i className={item.icon}></i>
                                    </a>

                                </div>

                                {/* Content */}
                                <div className="mb-3">
                                    <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                                        {item.review}
                                    </p>
                                </div>

                                {/* Timestamp */}
                                <div className="text-gray-500 text-xs">
                                    {item.date}
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>

        </>
    )
}