import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import SEO from '../SEO';

export const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        try {

            if (!formData.fullName || formData.fullName.trim() === "") {
                return message.error("Full Name Is Required");
            }

            if (!formData.email || formData.email.trim() === "") {
                return message.error("Email ID Is Required");
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                return message.warning("Invlaid Email ID");
            }

            if (!formData.phone || formData.phone.trim() === "") {
                return message.error("Phone Number Is Required");
            }

            if (!/^[6-9]\d{9}$/.test(formData.phone)) {
                return message.error("Invalid Phone Number");
            }

            if (!formData.password || formData.password.trim() === "") {
                return message.error("Password is required");
            }

            if (formData.password.length < 6) {
                return message.warning("Password must be at least 6 characters long");
            }

            if (!/[A-Z]/.test(formData.password)) {
                return message.warning("Password must contain at least one uppercase letter");
            }

            if (!/[a-z]/.test(formData.password)) {
                return message.warning("Password must contain at least one lowercase letter");
            }

            if (!/[0-9]/.test(formData.password)) {
                return message.warning("Password must contain at least one number");
            }

            if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]/.test(formData.password)) {
                return message.warning("Password must contain at least one special character");
            }

        } catch (err) {

            message.error(err.message);
            console.log(err);

        }

    };

    return (

        <>

            <SEO
                title={`Register | ${import.meta.env.VITE_SITE_NAME}`}
                canonical={`${import.meta.env.VITE_WEB_URL}/register`}
            />

            <main className="min-h-[100dvh] flex items-center justify-center bg-white sm:bg-slate-50 p-0 sm:p-4">

                <div className="w-full min-h-[100dvh] sm:min-h-0 sm:max-w-md bg-white p-5 sm:p-8 rounded-none sm:rounded-2xl shadow-none sm:shadow-xl sm:shadow-slate-200/60 border-0 sm:border sm:border-slate-100 flex flex-col justify-center">

                    {/* Logo Section */}
                    <div className="flex justify-center">

                        <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">

                            <img
                                src="/assets/upload.png"
                                alt={import.meta.env.VITE_SITE_NAME || 'Logo'}
                                className="w-14 h-14 object-contain"
                            />

                        </Link>

                    </div>

                    {/* Header */}
                    <div className="mt-6 text-center">

                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Create Account
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Enter your details below to get started
                        </p>

                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                        {/* Full Name */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700">Full Name</label>

                            <div className="relative mt-1.5 rounded-lg">

                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <i className="ri-user-line text-lg"></i>
                                </div>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200"
                                />

                            </div>

                        </div>

                        {/* Email ID */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700">Email Address</label>

                            <div className="relative mt-1.5 rounded-lg">

                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <i className="ri-mail-line text-lg"></i>
                                </div>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200"
                                />

                            </div>

                        </div>

                        {/* Phone Number */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700">Phone Number</label>

                            <div className="relative mt-1.5 rounded-lg">

                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <i className="ri-phone-line text-lg"></i>
                                </div>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200"
                                />

                            </div>

                        </div>

                        {/* Password */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700">Password</label>

                            <div className="relative mt-1.5 rounded-lg">

                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <i className="ri-lock-line text-lg"></i>
                                </div>

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-200"
                                >
                                    <i className={showPassword ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"}>
                                    </i>

                                </button>

                            </div>

                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-indigo-500/20 shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
                        >
                            Create Account
                        </button>

                        {/* Footer Link */}
                        <p className="text-center text-sm text-slate-600 pt-4">
                            Already have an account?{' '}

                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                            >
                                Sign in
                            </Link>

                        </p>

                    </form>

                </div>

            </main>

        </>
    );
};