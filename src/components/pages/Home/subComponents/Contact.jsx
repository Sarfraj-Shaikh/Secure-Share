import React, { useEffect, useState } from 'react';
import { message } from 'antd';

export const Contact = () => {

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

    const [form, setForm] = useState({
        subject: "",
        message: ""
    });

    const handleInput = (event) => {

        try {

            setForm((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }));

        } catch (err) {

            message.error(err.message);
            console.log(err);

        }
    };

    const submitForm = () => {

        try {

            if (!form.subject || form.subject.trim() === "") {
                return message.error("Subject Is Required");
            }

            if (!form.message || form.message.trim() === "") {
                return message.error("Message Is Required");
            }

            const recipient = "contact@example.com";
            const subject = encodeURIComponent(form.subject);
            const userMessage = encodeURIComponent(form.message);

            window.location.href = `mailto:${recipient}?subject=${subject}&body=${userMessage}`

            setForm({
                subject: "",
                message: ""
            });

        } catch (err) {

            message.error(err.message);
            console.log(err);

        }

    }

    return (
        <>
            <div
                id="contact"
                className="w-full py-20 px-6 flex items-center justify-center"
            >

                <div className="w-full px-[5%] md:px-[10%] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">

                    {/*  Left Side  */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="50"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className="flex flex-col justify-start pt-1"
                    >

                        <div className="flex items-center gap-2.5 mb-6">

                            <div className="size-2 rounded-full bg-orange-500 animate-pulse"></div>
                            <span className="text-zinc-500 font-medium text-sm tracking-wide">
                                CONTACT US
                            </span>

                        </div>

                        <h1 className="text-4xl font-medium text-zinc-900 mb-3 sm:mb-5">
                            We’re Here to Help You
                        </h1>

                        <p className="text-base text-zinc-400 leading-relaxed max-w-[420px]">
                            Whether it’s support, feedback, or inquiries — feel free to contact us anytime.
                        </p>

                        <div className="flex flex-col space-y-5 py-5">

                            <div className="flex items-center gap-2">

                                <div className="size-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                    <i className="ri-mail-line text-zinc-600"></i>
                                </div>

                                <span
                                    onClick={() => (window.location.href = "mailto:contact@example.com")}
                                    className="text-sm text-zinc-600 cursor-pointer transition-colors duration-300 ease-in-out hover:text-black"
                                >
                                    contact@example.com
                                </span>
                            </div>

                            <div className="flex items-center gap-2">

                                <div className="size-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                    <i className="ri-phone-line text-zinc-600"></i>
                                </div>

                                <span
                                    onClick={() => (window.location.href = "tel:+911234567890")}
                                    className="text-sm text-zinc-600 cursor-pointer transition-colors duration-300 ease-in-out hover:text-black"
                                >
                                    +91 1234-5678-90
                                </span>
                            </div>

                            <div className="flex items-center gap-2">

                                <div className="size-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                    <i className="ri-map-pin-2-line text-zinc-600"></i>
                                </div>

                                <span
                                    onClick={() => (window.location.href = "tel:+911234567890")}
                                    className="text-sm text-zinc-600"
                                >
                                    Mumbai, Maharashtra, India
                                </span>
                            </div>

                        </div>

                    </div>

                    {/*  Right Side  */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="50"
                        data-aos-duration="700"
                        data-aos-easing="ease-out-cubic"
                        className="flex flex-col gap-5"
                    >

                        <div className="flex flex-col gap-2.5">

                            <label className="text-zinc-400 text-sm">Subject</label>

                            <input
                                type="text"
                                placeholder="Enter Your Subject"
                                onChange={(e) => handleInput(e)}
                                value={form.subject}
                                name="subject"
                                className="w-full px-3.5 py-2.5 rounded-sm bg-zinc-50 border border-zinc-300 text-zinc-600 placeholder:text-zinc-400 text-sm focus:outline-none focus:border-zinc-400 transition-colors capitalize"
                            />

                        </div>

                        <div className="flex flex-col gap-2.5">

                            <label className="text-zinc-400 text-sm">Message</label>

                            <textarea
                                placeholder="Enter Your Message…"
                                onChange={(e) => handleInput(e)}
                                value={form.message}
                                rows="6"
                                name="message"
                                className="w-full px-3.5 py-3 rounded-sm bg-zinc-50 border border-zinc-300 text-zinc-600 placeholder:text-zinc-400 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none capitalize"
                            >
                            </textarea>

                        </div>

                        <button
                            onClick={submitForm}
                            className="w-full mt-1 bg-black hover:bg-zinc-900 border border-zinc-300 text-white text-sm font-medium py-3 rounded-sm transition-colors cursor-pointer"
                        >
                            Submit
                        </button>

                    </div>

                </div>

            </div>
        </>
    );
};