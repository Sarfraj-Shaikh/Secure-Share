import { message } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO';

export const VerifyAccount = () => {

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'failed'

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Basic Validation
        if (!email || email.trim() === '') {
            message.error('Email ID is required.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message.error('Please enter a valid email address.');
            return;
        }

        setStatus('loading');

        try {
            // TODO: Replace with your actual backend API call
            // await axios.post('/api/auth/forgot-password', { email });

            // Simulating API call response (Success)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setStatus('success');

        } catch (err) {

            message.error(err.message);
            console.log(err);

        }
    };

    const handleResend = () => {
        handleSubmit({ preventDefault: () => { } });
    };

    return (

        <>
            <SEO
                title={`Verify Account | ${import.meta.env.VITE_SITE_NAME}`}
                canonical={`${import.meta.env.VITE_WEB_URL}/register`}
            />

            <main className="min-h-[100dvh] flex items-center justify-center bg-white sm:bg-slate-50 p-0 sm:p-4">

                <div className="w-full min-h-[100dvh] sm:min-h-0 sm:max-w-md bg-white p-5 sm:p-8 rounded-none sm:rounded-2xl shadow-none sm:shadow-xl sm:shadow-slate-200/60 border-0 sm:border sm:border-slate-100 flex flex-col justify-center">

                    {/* --- STATE 1: INITIAL INPUT FORM & LOADING --- */}
                    {(status === 'idle' || status === 'loading') && (

                        <>
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

                            <div className="mt-6 text-center">

                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Verify Account
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your email address to verify your account.
                                </p>

                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                                <div>

                                    <label className="block text-sm font-medium text-slate-700">
                                        Email ID
                                    </label>

                                    <div className="relative mt-1.5 rounded-lg">

                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">

                                            <i className="ri-mail-line text-lg"></i>

                                        </div>

                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            disabled={status === 'loading'}
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200 disabled:opacity-60"
                                        />

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full mt-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-indigo-500/20 shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin text-lg"></i>
                                            Sending Link...
                                        </>
                                    ) : (
                                        'Send Link'
                                    )}
                                </button>

                            </form>

                            {/* Footer Link */}
                            <p className="text-center text-sm text-slate-600 pt-6 mt-2 border-slate-100">
                                Already Verified?{' '}

                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                                >
                                    Back to Login
                                </Link>

                            </p>

                        </>
                    )}

                    {/* --- STATE 2: SUCCESS CONFIRMATION UI --- */}
                    {status === 'success' && (

                        <div className="mt-6 text-center flex flex-col items-center">

                            {/* Success Icon */}
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                                <i className="ri-mail-send-line text-3xl"></i>
                            </div>

                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                Check Your Email
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                We have sent a verification link to:
                                <br />
                                <span className="font-semibold text-slate-900">{email}</span>
                            </p>

                            {/* User Guide Box */}
                            <div
                                className="mt-6 w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left space-y-2.5"
                            >

                                <div className="flex items-start gap-2.5 text-sm text-slate-600">

                                    <i className="ri-information-line text-blue-600 text-base shrink-0 mt-0.5">
                                    </i>

                                    <span>
                                        Click on the link inside the email to complete verification.
                                    </span>

                                </div>

                                <div className="flex items-start gap-2.5 text-sm text-slate-600">

                                    <i className="ri-folder-shield-2-line text-amber-600 text-base shrink-0 mt-0.5">
                                    </i>

                                    <span>
                                        If you don't see the email, please check your <strong>Spam or Junk folder</strong>.
                                    </span>

                                </div>

                            </div>

                            {/* Resend Section */}
                            <div className="mt-6 text-sm text-slate-600">
                                Didn't receive the email?{' '}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
                                >
                                    Resend Link
                                </button>
                            </div>

                        </div>

                    )}

                    {/* --- STATE 3: FAILURE / ERROR UI --- */}
                    {status === 'failed' && (

                        <div className="mt-6 flex flex-col items-center text-center">

                            {/* Error Icon */}
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
                                <i className="ri-close-circle-fill text-5xl text-red-500"></i>
                            </div>

                            <h2 className="mt-6 text-2xl font-bold text-slate-900">
                                Verification Failed
                            </h2>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                                We couldn't send the verification link to your email at the moment.
                                Please try again in a few moments.
                            </p>

                            <div className="mt-8 w-full max-w-sm">

                                <button
                                    type="button"
                                    onClick={() => setStatus("idle")}
                                    className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
                                >
                                    <i className="ri-refresh-line mr-2"></i>
                                    Try Again
                                </button>

                            </div>

                        </div>

                    )}

                </div>
            </main>

        </>

    );
};